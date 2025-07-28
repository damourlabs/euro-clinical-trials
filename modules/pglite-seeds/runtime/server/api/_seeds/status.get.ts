import { PGlite } from '@electric-sql/pglite'
import { SeedsManager } from '../../plugins/seeds-manager'

export default defineEventHandler(async () => {
    try {
        const seedsConfig = useRuntimeConfig().pgliteSeeds
        const migrationsConfig = useRuntimeConfig().pgliteMigrations

        if (!seedsConfig?.enabled) {
            return {
                enabled: false,
                message: 'Seeding is disabled'
            }
        }

        // Initialize PGLite database
        const db = new PGlite({
            dataDir: migrationsConfig?.dataDir || seedsConfig.dataDir,
        })

        // Get applied seeds
        const appliedSeedsResult = await db.query(
            `SELECT filename, applied_at, environment FROM ${seedsConfig.seedsTable} 
             WHERE environment = $1 
             ORDER BY applied_at DESC`,
            [seedsConfig.environment]
        )

        // Get available seed files
        const seedsManager = new SeedsManager(db, seedsConfig)
        const availableSeeds = await seedsManager.getSeedFiles()

        return {
            enabled: true,
            environment: seedsConfig.environment,
            autoSeed: seedsConfig.autoSeed,
            forceReseed: seedsConfig.forceReseed,
            skipIfDataExists: seedsConfig.skipIfDataExists,
            appliedSeeds: appliedSeedsResult.rows,
            availableSeeds: availableSeeds.map(seed => ({
                filename: seed.filename,
                type: seed.type,
                order: seed.order
            })),
            totalApplied: appliedSeedsResult.rows.length,
            totalAvailable: availableSeeds.length
        }

    } catch (error) {
        return {
            enabled: false,
            error: `Failed to get seeding status: ${error instanceof Error ? error.message : String(error)}`
        }
    }
})
