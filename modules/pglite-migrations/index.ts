import { defineNuxtModule, createResolver, addServerPlugin, addServerHandler } from '@nuxt/kit'

export interface ModuleOptions {
    /**
     * Path to migrations directory relative to project root
     * @default 'server/database/migrations'
     */
    migrationsPath: string

    /**
     * PGLite database data directory
     * @default '.db'
     */
    dataDir: string

    /**
     * Run migrations automatically on startup
     * @default true in development, false in production
     */
    autoMigrate: boolean

    /**
     * Migration table name
     * @default 'migrations'
     */
    migrationTable: string

    /**
     * Enable migration health check endpoints
     * @default true
     */
    healthChecks: boolean
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'pglite-migrations',
        configKey: 'pgliteMigrations',
        compatibility: {
            nuxt: '^3.0.0 || ^4.0.0'
        }
    },
    defaults: {
        migrationsPath: 'server/database/migrations',
        dataDir: '.db/pglite',
        autoMigrate: process.env.NODE_ENV !== 'production',
        migrationTable: 'migrations',
        healthChecks: true
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        // Add server plugin for migration handling
        addServerPlugin(resolver.resolve('./runtime/server/plugins/migrations'))
        addServerPlugin(resolver.resolve('./runtime/server/plugins/database'))

        // Add health check routes if enabled
        if (options.healthChecks) {
            addServerHandler({
                route: '/api/_health/database',
                handler: resolver.resolve('./runtime/server/api/_health/database.get')
            })
            addServerHandler({
                route: '/api/_health/migrations',
                handler: resolver.resolve('./runtime/server/api/_health/migrations.get')
            })

        }

        // Add module options to runtime config
        nuxt.options.runtimeConfig.pgliteMigrations = options

        // Ensure nitro experimental database is enabled
        nuxt.options.nitro = nuxt.options.nitro || {}
        nuxt.options.nitro.experimental = nuxt.options.nitro.experimental || {}
        nuxt.options.nitro.experimental.database = true
    }
})
