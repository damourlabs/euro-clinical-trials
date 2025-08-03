import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    // Layer configuration
    compatibilityDate: '2024-08-03',

    // Auto-import auth composables and stores
    imports: {
        dirs: ['stores/**', 'composables/**']
    },

    // Enable auto-imports for components
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        }
    ],

    // CSS framework
    css: [],

    // Modules required by the auth layer
    modules: [
        '@pinia/nuxt',
        'nuxt-auth-utils'
    ],

    // Default auth configuration that can be overridden by the main app
    runtimeConfig: {
        authSecret: process.env.AUTH_SECRET || '',
        oauth: {
            github: {
                clientId: process.env.OAUTH_GITHUB_CLIENT_ID || '',
                clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET || ''
            }
        },
        public: {
            auth: {
                // These can be overridden by the main app
                enableTwoFactor: true,
                enableMagicLink: true,
                enableOAuth: true,
                sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
                requireEmailVerification: true
            }
        }
    },


    // TypeScript configuration
    typescript: {
        includeWorkspace: true
    }
})
