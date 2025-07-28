import { usersSchema, type User } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"
import { eq, and, ne } from "drizzle-orm"

// Update user schema without sensitive fields and without required fields
const UpdateUserSchema = usersSchema.omit({
    uuid: true,
    emailVerificationToken: true,
    emailVerificationExpires: true,
    magicLinkToken: true,
    magicLinkExpires: true,
    twoFactorSecret: true,
    twoFactorToken: true,
    twoFactorExpires: true,
    accountLockedUntil: true,
    loginAttempts: true,
    lastLoginAt: true,
    githubId: true,
    createdAt: true,
    updatedAt: true,
}).partial()

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
    // Users can update their own profile, admins can update any user
    // if (currentUser.uuid !== id && currentUser.role !== 'Admin') {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: 'Insufficient permissions to update this user'
    //   })
    // }

    // Check if the user exists
    const existingUsers = await useDb().select().from(tables.users).where(eq(tables.users.uuid, id))

    if (!existingUsers || existingUsers.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found'
        })
    }

    if (existingUsers.length > 1) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Multiple users found with the same ID, this should not happen'
        })
    }

    // Get the existing user data
    const existingUser = existingUsers[0]

    // Get the updated data from the request body
    const { success, error, data } = await readValidatedBody(event, UpdateUserSchema.safeParse)

    if (!success) {
        console.error('Invalid user data:', error);
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid user data',
            data: error
        })
    }

    if (!data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'User data is required'
        })
    }

    // If email is being updated, check if it's already taken by another user
    if (data.email && data.email !== existingUser.email) {
        const emailCheckUsers = await useDb().select().from(tables.users)
            .where(and(
                eq(tables.users.email, data.email),
                ne(tables.users.uuid, id)
            ))

        if (emailCheckUsers.length > 0) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Email is already taken by another user'
            })
        }
    }

    const newUserData = {
        ...existingUser,
        ...data,
        updatedAt: new Date() // Update the timestamp
    }

    // Update the user in database
    const [updatedUser] = await useDb().update(tables.users)
        .set(newUserData)
        .where(eq(tables.users.uuid, id))
        .returning()

    const sanitizedUser = sanitizeUser(updatedUser)

    const response: ServerResponse<typeof sanitizedUser> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'User updated successfully',
        data: sanitizedUser
    }

    return response
})
