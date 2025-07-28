import { defineNuxtModule, createResolver, addServerPlugin, addServerHandler } from '@nuxt/kit'

export interface ModuleOptions {
    /**
     * Enable/disable seeding
     * @default true in development, false in production
     */
    enabled: boolean

    /**
     * Path to seeds directory relative to project root
     * @default 'server/database/seeds'
     */
    seedsPath: string

    /**
     * Environment-specific seeds
     * @default process.env.NODE_ENV || 'development'
     */
    environment: string

    /**
     * Force re-seeding (will truncate existing data)
     * @default false
     */
    forceReseed: boolean

    /**
     * PGLite database data directory (should match migrations module)
     * @default '.db/pglite'
     */
    dataDir: string

    /**
     * Seeds tracking table name
     * @default 'seeds'
     */
    seedsTable: string

    /**
     * Run seeds automatically after migrations
     * @default true in development, false in production
     */
    autoSeed: boolean

    /**
     * Enable seeding API endpoints
     * @default true
     */
    apiEndpoints: boolean

    /**
     * Skip seeding if data already exists
     * @default true
     */
    skipIfDataExists: boolean
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'pglite-seeds',
        configKey: 'pgliteSeeds',
        compatibility: {
            nuxt: '^3.0.0 || ^4.0.0'
        }
    },
    defaults: {
        enabled: process.env.NODE_ENV !== 'production',
        seedsPath: 'server/database/seeds',
        environment: process.env.NODE_ENV || 'development',
        forceReseed: false,
        dataDir: '.db/pglite',
        seedsTable: 'seeds',
        autoSeed: process.env.NODE_ENV !== 'production',
        apiEndpoints: true,
        skipIfDataExists: true
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        // Only setup if enabled
        if (!options.enabled) {
            console.log('🌱 PGLite Seeds: Module disabled')
            return
        }

        // Add server plugin for seed handling
        addServerPlugin(resolver.resolve('./runtime/server/plugins/seeds'))

        // Add API endpoints if enabled
        if (options.apiEndpoints) {
            addServerHandler({
                route: '/api/_seeds/run',
                handler: resolver.resolve('./runtime/server/api/_seeds/run.post')
            })
            addServerHandler({
                route: '/api/_seeds/status',
                handler: resolver.resolve('./runtime/server/api/_seeds/status.get')
            })
        }

        // Add module options to runtime config
        nuxt.options.runtimeConfig.pgliteSeeds = options

        console.log('🌱 PGLite Seeds: Module configured')
    }
})
