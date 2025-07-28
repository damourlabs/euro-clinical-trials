export default defineEventHandler(async () => {
  try {
    // Get database instance
    const db = appDatabase()

    console.log('Checking database health.. from module')

    // Simple health check query
    await db.exec('SELECT 1')

    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      database: 'pglite'
    }
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Database not ready',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
