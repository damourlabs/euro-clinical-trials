import type { User } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"
import { eq } from "drizzle-orm"

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
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'User ID is required'
        })
    }

    // TODO: Implement proper authentication check
    // const currentUser = await getCurrentUser(event)
    // if (!currentUser) {
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: 'Authentication required'
    //   })
    // }

    // TODO: Implement access control
    // Only allow users to view their own profile unless they are admin/coordinator/monitor
    // if (currentUser.uuid !== id && !['Admin', 'Coordinator', 'Monitor'].includes(currentUser.role)) {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: 'Insufficient permissions to view this user'
    //   })
    // }

    const users = await db.select().from(tables.users).where(eq(tables.users.uuid, id)).limit(1)

    if (!users || users.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found'
        })
    }

    const user = users[0]
    const sanitizedUser = sanitizeUser(user)

    const response: ServerResponse<typeof sanitizedUser> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'User retrieved successfully',
        data: sanitizedUser
    }

    return response
})
