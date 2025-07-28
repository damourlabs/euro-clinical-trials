import { PGlite } from '@electric-sql/pglite'
import { SeedsManager } from './seeds-manager'

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

export default defineNitroPlugin(async () => {
    const seedsConfig = useRuntimeConfig().pgliteSeeds as SeedsConfig
    const migrationsConfig = useRuntimeConfig().pgliteMigrations as { dataDir?: string }

    // Skip if not enabled or auto-seed is disabled
    if (!seedsConfig?.enabled || !seedsConfig?.autoSeed) {
        return
    }

    try {
        // Wait a bit to ensure migrations have completed
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Initialize PGLite database (using same config as migrations)
        const db = new PGlite({
            dataDir: migrationsConfig?.dataDir || seedsConfig.dataDir,
        })

        const seedsManager = new SeedsManager(db, seedsConfig)
        const result = await seedsManager.runSeeds()

        if (result.errors.length > 0) {
            console.warn(`🌱 Seeding completed with ${result.errors.length} errors`)
        }

    } catch (error) {
        console.error('🌱 Failed to initialize seeding:', error)
    }
})
