import { usersSchema, type User } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { z } from "zod";
import { useDb } from "~/server/utils/drizzle";
import { eq } from "drizzle-orm"

// Create user schema without sensitive fields for API creation
const CreateUserSchema = usersSchema.omit({
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
})

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

    const { data: params } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).safeParse)

    if (!params) {
        throw createError({
            statusCode: 400,
            statusMessage: 'User ID is required'
        })
    }

    const { id } = params

    // TODO: Implement proper authentication check
    // const currentUser = await getCurrentUser(event)
    // if (!currentUser) {
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: 'Authentication required'
    //   })
    // }

    // TODO: Implement role-based access control
    // Only admins can create users
    // if (currentUser.role !== 'Admin') {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: 'Only administrators can create users'
    //   })
    // }

    const { success, error, data } = await readValidatedBody(event, CreateUserSchema.safeParse)

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

    // Check if user with email already exists
    const existingUsers = await useDb().select().from(tables.users).where(eq(tables.users.email, data.email))
    if (existingUsers.length > 0) {
        throw createError({
            statusCode: 409,
            statusMessage: 'User with this email already exists'
        })
    }

    console.log('Creating user with data:', data)

    // Save the new user to database
    const [newUser] = await useDb().insert(tables.users).values({
        ...data,
        uuid: id // Use the provided ID
    }).returning()

    const sanitizedUser = sanitizeUser(newUser)

    // Return the created user
    const response: ServerResponse<typeof sanitizedUser> = {
        status: 'success',
        statusCode: 201,
        statusText: 'Created',
        message: 'User created successfully',
        data: sanitizedUser
    }
    return response

})
