import { PGlite } from '@electric-sql/pglite'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineNitroPlugin(async () => {
    const config = useRuntimeConfig().pgliteMigrations

    // Skip migrations if auto-migrate is disabled
    if (!config.autoMigrate) {
        return
    }

    try {
        console.log('🔄 PGLite Migrations: Starting database migration process...')

        // Initialize PGLite database
        const db = new PGlite({
            dataDir: config.dataDir,
        })

        // Create migrations tracking table if it doesn't exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS ${config.migrationTable} (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL UNIQUE,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            checksum VARCHAR(64)
            );
        `)

        // Get list of applied migrations
        const appliedMigrationsResult = await db.query<{ filename: string }>(
            `SELECT filename FROM ${config.migrationTable} ORDER BY filename`
        )
        const appliedMigrations = new Set(
            appliedMigrationsResult.rows.map(row => row.filename as string)
        )

        // Read migration files
        const migrationsDir = join(process.cwd(), config.migrationsPath)
        const migrationFiles = await readdir(migrationsDir)

        // Filter and sort SQL migration files
        const sqlFiles = migrationFiles
            .filter(file => file.endsWith('.sql'))
            .sort()

        let migrationsApplied = 0

        for (const filename of sqlFiles) {
            if (appliedMigrations.has(filename)) {
                console.log(`⏭️  PGLite Migrations: Skipping already applied migration: ${filename}`)
                continue
            }

            try {
                console.log(`🔧 PGLite Migrations: Applying migration: ${filename}`)

                const migrationPath = join(migrationsDir, filename)
                const migrationSQL = await readFile(migrationPath, 'utf-8')

                // Calculate checksum for integrity verification
                const checksum = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(migrationSQL))
                const checksumHex = Array.from(new Uint8Array(checksum))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('')

                // Split migration by statement breakpoint and execute each statement
                const statements = migrationSQL
                    .split('--> statement-breakpoint')
                    .map(stmt => stmt.trim())
                    .filter(stmt => stmt.length > 0)

                // Execute migration in a transaction
                await db.transaction(async (tx) => {
                    for (const statement of statements) {
                        if (statement.trim()) {
                            await tx.exec(statement)
                        }
                    }

                    // Record this migration as applied with checksum
                    await tx.exec(
                        `INSERT INTO ${config.migrationTable} (filename, checksum) VALUES ('${filename}', '${checksumHex}')`
                    )
                })

                migrationsApplied++
                console.log(`✅ PGLite Migrations: Successfully applied migration: ${filename}`)

            } catch (error) {
                console.error(`❌ PGLite Migrations: Failed to apply migration ${filename}:`, error)
                throw error
            }
        }

        if (migrationsApplied === 0) {
            console.log('✨ PGLite Migrations: Database is up to date - no migrations needed')
        } else {
            console.log(`🎉 PGLite Migrations: Successfully applied ${migrationsApplied} migration(s)`)
        }

        await db.close()

    } catch (error) {
        console.error('💥 PGLite Migrations: Database migration failed:', error)
        // In development, we might want to fail fast
        if (process.env.NODE_ENV === 'development') {
            throw error
        }
    }
    // nitroApp.hooks.hook('', async () => {
    // })
})
