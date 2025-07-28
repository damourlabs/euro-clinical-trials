export default defineEventHandler(async () => {
  try {
    // Get database instance
    const db = appDatabase()

    // Check if migrations table exists
    const tableExists = await db.query<{
      exists: boolean
    }>(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'migrations'
      )
    `)

    if (!tableExists.rows[0]?.exists) {
      return {
        status: 'no_migrations_table',
        applied: 0,
        pending: 'unknown',
        message: 'Migrations table not found - migrations may not have been initialized'
      }
    }

    // Get applied migrations count
    const appliedResult = await db.query<{
      count: string
    }>('SELECT COUNT(*) as count FROM migrations')
    const appliedCount = Number(appliedResult.rows[0]?.count) || 0

    // Get total migration files count (this would need to be dynamically calculated)
    // For now, we'll just return the applied count

    return {
      status: 'ready',
      applied: appliedCount,
      pending: 0, // Would need filesystem access to calculate this properly
      lastApplied: appliedCount > 0 ?
        await db.query('SELECT filename, applied_at FROM migrations ORDER BY applied_at DESC LIMIT 1').then(result => result.rows[0])
        : null
    }
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Cannot check migration status',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})
