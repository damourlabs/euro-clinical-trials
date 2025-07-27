// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['nuxt-auth-utils', '@pinia/nuxt'],
  extends: ['github:damourlabs/ui'],
  runtimeConfig: {
    session: {
      name: 'session',
      maxAge: 60 * 60 * 24 * 7, // 7 days,
      password: '',
      cookie: {
        secure: true,
        sameSite: 'strict',
      },
      seal: {
        encryption: {
          algorithm: 'aes-256-cbc',
          iterations: 100000,
          minPasswordlength: 32,
          saltBits: 256,
        },
        ttl: 60 * 60 * 24 * 7, // 7 days
        localtimeOffsetMsec: 0,
        timestampSkewSec: 60 * 60 * 24 * 7, // 7 days
        integrity: {
          algorithm: 'sha256',
          iterations: 100000,
          minPasswordlength: 32,
          saltBits: 256,
        }
      }
    },
    oauth: {
      github: {
        clientId: '',
        clientSecret: '',
        redirectURL: '',
        scopes: [],
        emailRequired: true
      }
  nitro: {
    experimental: {
      database: true
    },
    database: {
      default: {
        connector: 'pglite',
      },
      pglite: {
        connector: 'pglite',
        options: {
          name: 'db-euro-clinical-trials',
          dataDir: 'db/pglite',
        }
      }
    },
  },
  $development: {
    nitro: {
      storage: {
        trials: {
          driver: 'fs',
          base: 'data/trials',
          options: {
            prefix: 'trials/',
            create: true,
          }
        },
        patients: {
          driver: 'fs',
          base: 'data/patients',
          options: {
            prefix: 'patients/',
            create: true,
          }
        },
      }
    },
  }
})
