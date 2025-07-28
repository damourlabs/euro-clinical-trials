import type { PGlite } from '@electric-sql/pglite'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { createHash } from 'node:crypto'

interface SeedRecord {
    id: number
    filename: string
    applied_at: string
    checksum: string
    environment: string
}

interface SeedFile {
    filename: string
    path: string
    type: 'sql' | 'ts' | 'js'
    order: number
}

interface SeedsConfig {
    enabled: boolean
    seedsPath: string
    environment: string
    forceReseed: boolean
    dataDir: string
    seedsTable: string
    autoSeed: boolean
    apiEndpoints: boolean
    skipIfDataExists: boolean
}

export class SeedsManager {
    private db: PGlite
    private config: SeedsConfig

    constructor(db: PGlite, config: SeedsConfig) {
        this.db = db
        this.config = config
    }

    async initialize() {
        // Create seeds tracking table if it doesn't exist
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS ${this.config.seedsTable} (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                checksum VARCHAR(64),
                environment VARCHAR(50) DEFAULT 'development',
                UNIQUE(filename, environment)
            );
        `)
    }

    async getAppliedSeeds(): Promise<Set<string>> {
        const result = await this.db.query<SeedRecord>(
            `SELECT filename FROM ${this.config.seedsTable} 
             WHERE environment = $1 
             ORDER BY filename`,
            [this.config.environment]
        )
        return new Set(result.rows.map(row => row.filename))
    }

    async getSeedFiles(): Promise<SeedFile[]> {
        const seedsDir = join(process.cwd(), this.config.seedsPath)

        try {
            const files = await readdir(seedsDir)
            const seedFiles: SeedFile[] = []

            for (const file of files) {
                const filePath = join(seedsDir, file)
                const stats = await stat(filePath)

                if (!stats.isFile()) continue

                const ext = extname(file).toLowerCase()
                if (!['.sql', '.ts', '.js'].includes(ext)) continue

                // Extract order number from filename (e.g., 001-users.sql -> 1)
                const orderMatch = file.match(/^(\d+)/)
                const order = orderMatch ? parseInt(orderMatch[1], 10) : 999

                seedFiles.push({
                    filename: file,
                    path: filePath,
                    type: ext.slice(1) as 'sql' | 'ts' | 'js',
                    order
                })
            }

            return seedFiles.sort((a, b) => a.order - b.order)
        } catch {
            console.warn(`🌱 Seeds directory not found: ${seedsDir}`)
            return []
        }
    }

    async checkDataExists(tableName: string): Promise<boolean> {
        try {
            const result = await this.db.query<{ table_exists: boolean }>(
                `SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = $1
                ) as table_exists`,
                [tableName]
            )

            if (!result.rows[0]?.table_exists) return false

            const countResult = await this.db.query<{ count: number }>(`SELECT COUNT(*) as count FROM ${tableName}`)
            return (countResult.rows[0]?.count || 0) > 0
        } catch {
            return false
        }
    }

    async executeSqlSeed(seedFile: SeedFile): Promise<void> {
        const content = await readFile(seedFile.path, 'utf-8')

        // Split by semicolon and execute each statement
        const statements = content
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0)

        for (const statement of statements) {
            try {
                await this.db.exec(statement)
            } catch (error) {
                console.error(`🌱 Error executing statement in ${seedFile.filename}:`, error)
                console.error(`Statement: ${statement}`)
                throw error
            }
        }
    }

    async executeJsSeed(seedFile: SeedFile): Promise<void> {
        // For future implementation of JS/TS seed files
        try {
            const module = await import(seedFile.path)
            const seedData = typeof module.default === 'function'
                ? await module.default(this.db)
                : module.default

            if (Array.isArray(seedData)) {
                // Handle array of objects (future feature)
                console.log(`🌱 JS/TS seed support not fully implemented yet for ${seedFile.filename}`)
            }
        } catch (error) {
            console.error(`🌱 Error executing JS/TS seed ${seedFile.filename}:`, error)
            throw error
        }
    }

    async recordSeedExecution(filename: string, checksum: string): Promise<void> {
        await this.db.query(
            `INSERT INTO ${this.config.seedsTable} (filename, checksum, environment) 
             VALUES ($1, $2, $3)
             ON CONFLICT (filename, environment) 
             DO UPDATE SET applied_at = CURRENT_TIMESTAMP, checksum = $2`,
            [filename, checksum, this.config.environment]
        )
    }

    calculateChecksum(content: string): string {
        return createHash('sha256').update(content).digest('hex')
    }

    async runSeeds(): Promise<{ applied: number; skipped: number; errors: string[] }> {
        const result = { applied: 0, skipped: 0, errors: [] as string[] }

        try {
            await this.initialize()
            console.log('🌱 PGLite Seeds: Starting seeding process...')

            const appliedSeeds = await this.getAppliedSeeds()
            const seedFiles = await this.getSeedFiles()

            if (seedFiles.length === 0) {
                console.log('🌱 No seed files found')
                return result
            }

            console.log(`🌱 Found ${seedFiles.length} seed files`)

            for (const seedFile of seedFiles) {
                try {
                    // Check if already applied and not forcing reseed
                    if (appliedSeeds.has(seedFile.filename) && !this.config.forceReseed) {
                        console.log(`🌱 Skipping already applied seed: ${seedFile.filename}`)
                        result.skipped++
                        continue
                    }

                    // Check for existing data if configured to skip
                    if (this.config.skipIfDataExists && !this.config.forceReseed) {
                        const tableName = this.extractTableNameFromSeed(seedFile.filename)
                        if (tableName && await this.checkDataExists(tableName)) {
                            console.warn(`🌱 Warning: Data exists in ${tableName}, skipping ${seedFile.filename}`)
                            result.skipped++
                            continue
                        }
                    }

                    console.log(`🌱 Applying seed: ${seedFile.filename}`)

                    const content = await readFile(seedFile.path, 'utf-8')
                    const checksum = this.calculateChecksum(content)

                    // Execute based on file type
                    if (seedFile.type === 'sql') {
                        await this.executeSqlSeed(seedFile)
                    } else {
                        await this.executeJsSeed(seedFile)
                    }

                    // Record successful execution
                    await this.recordSeedExecution(seedFile.filename, checksum)
                    result.applied++

                    console.log(`✅ Successfully applied seed: ${seedFile.filename}`)

                } catch (error) {
                    const errorMsg = `Failed to apply seed ${seedFile.filename}: ${error instanceof Error ? error.message : String(error)}`
                    console.error(`🌱 ${errorMsg}`)
                    result.errors.push(errorMsg)
                    // Continue with other seeds as per requirement
                }
            }

            console.log(`🌱 Seeding completed: ${result.applied} applied, ${result.skipped} skipped, ${result.errors.length} errors`)

        } catch (error) {
            const errorMsg = `Critical seeding error: ${error instanceof Error ? error.message : String(error)}`
            console.error(`🌱 ${errorMsg}`)
            result.errors.push(errorMsg)
        }

        return result
    }

    private extractTableNameFromSeed(filename: string): string | null {
        // Try to extract table name from filename (e.g., 001-users.sql -> users)
        const match = filename.match(/\d+-([^.]+)\./)
        return match ? match[1] : null
    }
}
