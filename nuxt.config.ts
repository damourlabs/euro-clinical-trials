// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['nuxt-auth-utils', '@pinia/nuxt'],
  extends: ['github:damourlabs/ui', {
    giget: {
      forceClean: true
    }
  }],
  ignore: [
    "**/.db/**"
  ],
  runtimeConfig: {
    // Private keys (server-side)
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    pgliteMigrations: {
      dataDir: '.db/pglite',
    },
    pgliteSeeds: {
      enabled: true,
      seedsPath: 'server/database/seeds',
      environment: 'development',
      forceReseed: false,
      dataDir: '.db/pglite',
      seedsTable: 'seeds',
      autoSeed: true,
      apiEndpoints: true,
      skipIfDataExists: true
    },
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
    },
    // Public keys (client-side)
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }
  },
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
