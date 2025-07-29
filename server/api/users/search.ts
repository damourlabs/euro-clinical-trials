import type { User } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"
import { or, ilike, and, inArray } from "drizzle-orm"

// Helper function to filter sensitive data from user objects
function sanitizeUser(user: User): Omit<User, 'emailVerificationToken' | 'emailVerificationExpires' | 'magicLinkToken' | 'magicLinkExpires' | 'twoFactorSecret' | 'twoFactorToken' | 'twoFactorExpires' | 'accountLockedUntil' | 'githubId'> {
    const {
        emailVerificationToken,
        emailVerificationExpires,
        magicLinkToken,
        magicLinkExpires,
        twoFactorSecret,
        twoFactorToken,
        twoFactorExpires,
        accountLockedUntil,
        githubId,
        ...sanitizedUser
    } = user;

    return sanitizedUser;
}

export default defineEventHandler(async (event) => {
    // TODO: Implement proper authentication check
    // const currentUser = await getCurrentUser(event)
    // if (!currentUser) {
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: 'Authentication required'
    //   })
    // }

    // TODO: Implement role-based access control
    // Only users who can create trials should access this endpoint
    // const allowedRoles = ['Admin', 'Coordinator', 'Sponsor', 'Investigator']
    // if (!allowedRoles.includes(currentUser.role)) {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: 'Insufficient permissions to search users'
    //   })
    // }

    const query = getQuery(event)
    const { q: searchTerm, roles } = query

    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length < 2) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Search term must be at least 2 characters long'
        })
    }

    const db = useDb()

    const searchCondition = or(
        ilike(tables.users.name, `%${searchTerm.trim()}%`),
        ilike(tables.users.email, `%${searchTerm.trim()}%`),
        ilike(tables.users.institution, `%${searchTerm.trim()}%`)
    )

    let users;

    // Filter by roles if specified
    if (roles && typeof roles === 'string') {
        const roleList = roles.split(',').map(r => r.trim()).filter(r => r.length > 0)
        if (roleList.length > 0) {
            users = await db.select()
                .from(tables.users)
                .where(
                    and(
                        searchCondition,
                        inArray(tables.users.role, roleList)
                    )
                )
                .limit(20)
        } else {
            users = await db.select()
                .from(tables.users)
                .where(searchCondition)
                .limit(20)
        }
    } else {
        users = await db.select()
            .from(tables.users)
            .where(searchCondition)
            .limit(20)
    }

    // Sanitize user data before returning
    const sanitizedUsers = users.map(sanitizeUser)

    const response: ServerResponse<typeof sanitizedUsers> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: `Found ${sanitizedUsers.length} users matching search criteria`,
        data: sanitizedUsers
    }

    return response
})
