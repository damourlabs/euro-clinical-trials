import type { User } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";
import { eq, or, ilike, and } from "drizzle-orm";

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
    const db = useDb()
    const usersTable = tables.users

    // TODO: Implement proper authentication check
    // const currentUser = await getCurrentUser(event)
    // if (!currentUser) {
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: 'Authentication required'
    //   })
    // }

    // TODO: Implement role-based access control
    // const userRole = currentUser.role
    // if (!['Admin', 'Coordinator', 'Monitor'].includes(userRole)) {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: 'Insufficient permissions to view users list'
    //   })
    // }

    // Get query parameters for filtering
    const query = getQuery(event)
    const { role, search, page = 1, limit = 50 } = query

    // Build where conditions
    const whereConditions = []

    // Apply role filter if specified
    if (role && typeof role === 'string') {
        whereConditions.push(eq(usersTable.role, role))
    }

    // Apply search filter if specified (search by name or email)
    if (search && typeof search === 'string') {
        whereConditions.push(
            or(
                ilike(usersTable.name, `%${search}%`),
                ilike(usersTable.email, `%${search}%`),
                ilike(usersTable.institution, `%${search}%`)
            )
        )
    }

    // Apply pagination
    const offset = (Number(page) - 1) * Number(limit)

    // Build and execute query
    let users;

    if (whereConditions.length === 0) {
        // No filters, just get all users with pagination
        users = await db.select().from(usersTable).limit(Number(limit)).offset(offset)
    } else if (whereConditions.length === 1) {
        // Single condition
        users = await db.select().from(usersTable)
            .where(whereConditions[0])
            .limit(Number(limit))
            .offset(offset)
    } else {
        // Multiple conditions - combine with AND
        const combinedCondition = whereConditions.reduce((acc, condition, index) => {
            return index === 0 ? condition : and(acc, condition)
        })

        users = await db.select().from(usersTable)
            .where(combinedCondition)
            .limit(Number(limit))
            .offset(offset)
    }

    if (users.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No users found'
        })
    }

    // Sanitize user data before returning
    const sanitizedUsers = users.map(sanitizeUser)

    const response: ServerResponse<typeof sanitizedUsers> = {
        message: 'Users fetched successfully',
        status: 'success',
        statusText: 'OK',
        statusCode: 200,
        data: sanitizedUsers
    }

    return response
})
