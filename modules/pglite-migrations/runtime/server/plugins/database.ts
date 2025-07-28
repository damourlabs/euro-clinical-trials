import { PGlite } from '@electric-sql/pglite'

let dbInstance: PGlite | null = null

export default defineNitroPlugin(async (nitroApp) => {

    const { dataDir } = useRuntimeConfig().pgliteMigrations

    console.log('🔌 Initializing database connection...')

    // Initialize database instance
    dbInstance = new PGlite({
        dataDir: dataDir,
    })

    // Test database connection
    try {
        await dbInstance.exec('SELECT 1')
        console.log('✅ Database connection established')
    } catch (error) {
        console.error('❌ Database connection failed:', error)
        throw error
    }

    // Register database instance globally
    globalThis.appDatabase = () => {
        if (!dbInstance) {
            throw new Error('Database not initialized')
        }
        return dbInstance
    }

    // Clean up on app close
    nitroApp.hooks.hook('close', async () => {
        if (dbInstance) {
            console.log('🔌 Closing database connection...')
            await dbInstance.close()
            dbInstance = null
        }
    })
})

// Type declaration for global appDatabase function
declare global {
    var appDatabase: () => PGlite
}
