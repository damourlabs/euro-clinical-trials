import { PGlite } from '@electric-sql/pglite'
import { SeedsManager } from '../../plugins/seeds-manager'

export default defineEventHandler(async (event) => {
    try {
        const seedsConfig = useRuntimeConfig().pgliteSeeds
        const migrationsConfig = useRuntimeConfig().pgliteMigrations

        if (!seedsConfig?.enabled) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Seeding is disabled'
            })
        }

        // Get request body for options
        const body = await readBody(event).catch(() => ({}))
        const { forceReseed = false, environment } = body

        // Initialize PGLite database
        const db = new PGlite({
            dataDir: migrationsConfig?.dataDir || seedsConfig.dataDir,
        })

        // Create a temporary config with overrides
        const tempConfig = {
            ...seedsConfig,
            forceReseed: forceReseed || seedsConfig.forceReseed,
            environment: environment || seedsConfig.environment
        }

        // Import the SeedsManager class
        const seedsManager = new SeedsManager(db, tempConfig)

        const result = await seedsManager.runSeeds()

        return {
            success: true,
            message: `Seeding completed: ${result.applied} applied, ${result.skipped} skipped`,
            details: result
        }

    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Seeding failed: ${error instanceof Error ? error.message : String(error)}`
        })
    }
})
