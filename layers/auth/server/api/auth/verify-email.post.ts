import { z } from 'zod'
import { useDb } from '~/server/utils/drizzle'
import { eq } from 'drizzle-orm'
import type { ServerResponse } from '~/models/utils'

// Email verification schema
const EmailVerifySchema = z.object({
    token: z.string().min(1, 'Token is required'),
    email: z.string().email('Valid email is required')
})

export default defineEventHandler(async (event) => {
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        })
    }

    const db = useDb()

    // Validate request body
    const { success, error, data } = await readValidatedBody(event, EmailVerifySchema.safeParse)

    if (!success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid verification data',
            data: error.errors
        })
    }

    if (!data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Verification data is required'
        })
    }

    try {
        // Find user by email
        const users = await db
            .select()
            .from(tables.users)
            .where(eq(tables.users.email, data.email))
            .limit(1)

        if (users.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found'
            })
        }

        const user = users[0]

        // Check if already verified
        if (user.emailVerified) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email is already verified'
            })
        }

        // Check verification token
        if (!user.emailVerificationToken || !user.emailVerificationExpires) {
            throw createError({
                statusCode: 400,
                statusMessage: 'No email verification was requested'
            })
        }

        if (user.emailVerificationExpires < new Date()) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email verification link has expired'
            })
        }

        if (user.emailVerificationToken !== data.token) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid verification token'
            })
        }

        // Mark email as verified
        await db
            .update(tables.users)
            .set({
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null,
                updatedAt: new Date()
            })
            .where(eq(tables.users.uuid, user.uuid))

        // Log email verification
        // await db.insert(tables.auditLogs).values({
        //     trialUuid: 'crypto.randomUUID()', // Temporary
        //     userUuid: user.uuid,
        //     action: 'Update',
        //     entityType: 'User',
        //     entityUuid: user.uuid,
        //     timestamp: new Date(),
        //     ipAddress: getRequestIP(event),
        //     userAgent: getHeader(event, 'user-agent') || '',
        //     changes: {
        //         action: 'email_verified',
        //         email: user.email
        //     },
        //     oldValues: null,
        //     newValues: null,
        //     sessionId: null,
        // })

        const response: ServerResponse<{
            message: string
            emailVerified: boolean
        }> = {
            status: 'success',
            statusCode: 200,
            statusText: 'OK',
            message: 'Email verification successful',
            data: {
                message: 'Your email has been verified successfully. You can now sign in to your account.',
                emailVerified: true
            }
        }

        return response

    } catch (error: unknown) {
        console.error('Email verification error:', error)

        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error during email verification'
        })
    }
})
