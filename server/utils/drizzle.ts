import { drizzle } from 'drizzle-orm/pglite'
import * as schemas from '../database/schema'

export { sql, eq, and, or, avg, desc, asc } from 'drizzle-orm'

export const tables = schemas

export function useDb() {
    return drizzle(appDatabase())
}
