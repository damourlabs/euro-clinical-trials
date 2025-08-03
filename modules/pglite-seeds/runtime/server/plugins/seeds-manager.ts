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

        // Parse SQL statements safely, handling semicolons in strings and comments
        const statements = this.parseSqlStatements(content)

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

    /**
     * Parse SQL statements safely, handling semicolons within string literals and comments
     */
    private parseSqlStatements(content: string): string[] {
        const statements: string[] = []
        let currentStatement = ''
        let inSingleQuote = false
        let inDoubleQuote = false
        let inDollarQuote = false
        let dollarTag = ''
        let inSingleLineComment = false
        let inMultiLineComment = false
        let escaped = false

        for (let i = 0; i < content.length; i++) {
            const char = content[i]
            const nextChar = content[i + 1]
            const prevChar = content[i - 1]

            // Handle escape sequences
            if (escaped) {
                currentStatement += char
                escaped = false
                continue
            }

            // Handle single-line comments (-- comment)
            if (!inSingleQuote && !inDoubleQuote && !inDollarQuote && !inMultiLineComment) {
                if (char === '-' && nextChar === '-') {
                    inSingleLineComment = true
                    currentStatement += char
                    continue
                }
            }

            // End single-line comment on newline
            if (inSingleLineComment && (char === '\n' || char === '\r')) {
                inSingleLineComment = false
                currentStatement += char
                continue
            }

            // Handle multi-line comments (/* comment */)
            if (!inSingleQuote && !inDoubleQuote && !inDollarQuote && !inSingleLineComment) {
                if (char === '/' && nextChar === '*') {
                    inMultiLineComment = true
                    currentStatement += char
                    continue
                }
            }

            // End multi-line comment
            if (inMultiLineComment && char === '/' && prevChar === '*') {
                inMultiLineComment = false
                currentStatement += char
                continue
            }

            // Skip processing if we're in a comment
            if (inSingleLineComment || inMultiLineComment) {
                currentStatement += char
                continue
            }

            // Handle dollar-quoted strings ($$text$$ or $tag$text$tag$)
            if (!inSingleQuote && !inDoubleQuote) {
                if (char === '$') {
                    if (!inDollarQuote) {
                        // Start of potential dollar quote - extract tag
                        let tagEnd = i + 1
                        while (tagEnd < content.length &&
                            content[tagEnd] !== '$' &&
                            /[a-zA-Z0-9_]/.test(content[tagEnd])) {
                            tagEnd++
                        }

                        if (tagEnd < content.length && content[tagEnd] === '$') {
                            // Valid dollar quote start
                            dollarTag = content.substring(i, tagEnd + 1)
                            inDollarQuote = true
                            currentStatement += char
                            continue
                        }
                    } else {
                        // Check if this is the end of the current dollar quote
                        const potentialEndTag = content.substring(i, i + dollarTag.length)
                        if (potentialEndTag === dollarTag) {
                            inDollarQuote = false
                            dollarTag = ''
                            // Add the closing tag
                            currentStatement += potentialEndTag
                            i += dollarTag.length - 1
                            continue
                        }
                    }
                }
            }

            // Handle string literals
            if (!inDollarQuote) {
                // Single quotes
                if (char === '\'' && !inDoubleQuote) {
                    // Check for escaped single quote ('')
                    if (inSingleQuote && nextChar === '\'') {
                        currentStatement += char + nextChar
                        i++ // Skip next character
                        continue
                    }
                    inSingleQuote = !inSingleQuote
                }

                // Double quotes (identifiers)
                if (char === '"' && !inSingleQuote) {
                    // Check for escaped double quote ("")
                    if (inDoubleQuote && nextChar === '"') {
                        currentStatement += char + nextChar
                        i++ // Skip next character
                        continue
                    }
                    inDoubleQuote = !inDoubleQuote
                }

                // Handle backslash escapes
                if ((inSingleQuote || inDoubleQuote) && char === '\\') {
                    escaped = true
                }
            }

            // Statement delimiter - only process if we're not inside any quotes or comments
            if (char === ';' && !inSingleQuote && !inDoubleQuote && !inDollarQuote) {
                const trimmedStatement = currentStatement.trim()
                if (trimmedStatement.length > 0) {
                    statements.push(trimmedStatement)
                }
                currentStatement = ''
                continue
            }

            currentStatement += char
        }

        // Add any remaining statement
        const trimmedStatement = currentStatement.trim()
        if (trimmedStatement.length > 0) {
            statements.push(trimmedStatement)
        }

        return statements.filter(stmt => stmt.length > 0)
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
