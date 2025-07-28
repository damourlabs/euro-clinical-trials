export default defineNuxtPlugin(() => {
    // This plugin provides database utilities on the client side
    // and ensures the database is ready before the app starts

    return {
        provide: {
            database: {
                // Check if database is ready (useful for health checks)
                async isReady(): Promise<boolean> {
                    try {
                        const response = await $fetch('/api/_health/database')
                        return response.status === 'ready'
                    } catch {
                        return false
                    }
                },

                // Get migration status
                async getMigrationStatus() {
                    try {
                        return await $fetch('/api/_health/migrations')
                    } catch (error) {
                        console.warn('Failed to fetch migration status:', error)
                        return { applied: 0, pending: 0, status: 'unknown' }
                    }
                }
            }
        }
    }
})
