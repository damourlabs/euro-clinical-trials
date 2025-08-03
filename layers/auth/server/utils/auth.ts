import type { User } from '~/server/database/schema'
import { verifyAccessToken } from '~/server/utils/jwt'
import { useDb } from '~/server/utils/drizzle'
import { eq } from 'drizzle-orm'
import type { H3Event } from 'h3'

/**
 * Extended H3 event with user information
 */
export interface AuthenticatedEvent extends H3Event {
    context: {
        user: User
    }
}

/**
 * Middleware to require authentication
 * Verifies JWT token and adds user to event context
 */
export async function requireAuth(event: H3Event): Promise<User> {
    const db = useDb()

    // Try to get token from Authorization header
    let token = getHeader(event, 'authorization')?.replace('Bearer ', '')

    // Fallback: Try to get token from cookies
    if (!token) {
        token = getCookie(event, 'auth-token')
    }

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authentication required'
        })
    }

    // Verify the token
    const payload = verifyAccessToken(token)
    if (!payload) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid or expired token'
        })
    }

    // Get user from database
    const users = await db.select().from(tables.users).where(eq(tables.users.uuid, payload.userId)).limit(1)

    if (!users || users.length === 0) {
        throw createError({
            statusCode: 401,
            statusMessage: 'User not found'
        })
    }

    const user = users[0]

    // Check if user is active
    if (!user.isActive) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Account is deactivated'
        })
    }

    // Check if account is locked
    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
        throw createError({
            statusCode: 423,
            statusMessage: 'Account is temporarily locked due to security reasons'
        })
    }

    return user
}

/**
 * Middleware to require specific roles
 */
export async function requireRole(event: H3Event, allowedRoles: string[]): Promise<User> {
    const user = await requireAuth(event)

    if (!allowedRoles.includes(user.role)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Insufficient permissions'
        })
    }

    return user
}

/**
 * Optional authentication - returns user if authenticated, null otherwise
 */
export async function optionalAuth(event: H3Event): Promise<User | null> {
    try {
        return await requireAuth(event)
    } catch {
        return null
    }
}

/**
 * Middleware for admin-only access
 */
export async function requireAdmin(event: H3Event): Promise<User> {
    return await requireRole(event, ['Coordinator', 'Sponsor'])
}

/**
 * Middleware for clinical staff access
 */
export async function requireClinicalStaff(event: H3Event): Promise<User> {
    return await requireRole(event, ['Coordinator', 'Sponsor', 'Investigator', 'Monitor', 'Nurse'])
}
