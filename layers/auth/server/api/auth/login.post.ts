import { z } from 'zod'
import { useDb } from '~/server/utils/drizzle'
import { generateSecureToken, generateTwoFactorToken } from '~/server/utils/jwt'
import { sendMagicLinkEmail, sendTwoFactorEmail } from '~/server/utils/email'
import { eq } from 'drizzle-orm'
import type { ServerResponse } from '~/models/utils'

// Login schema
const LoginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    requestTwoFactor: z.boolean().default(false)
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
    const { success, error, data } = await readValidatedBody(event, LoginSchema.safeParse)

    if (!success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid login data',
            data: error.errors
        })
    }

    if (!data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Login data is required'
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
            // Don't reveal if user exists for security
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid email address or account not found'
            })
        }

        const user = users[0]

        // Check if user is active
        if (!user.isActive) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Account is not active. Please contact support.'
            })
        }

        // Check if account is locked
        if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
            throw createError({
                statusCode: 423,
                statusMessage: 'Account is temporarily locked due to multiple failed attempts. Please try again later.'
            })
        }

        // Check if email is verified
        if (!user.emailVerified) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Please verify your email address before signing in.'
            })
        }

        // Check if two-factor authentication is required
        if (user.twoFactorEnabled || data.requestTwoFactor) {
            // Generate and send 2FA code
            const twoFactorToken = generateTwoFactorToken()
            const twoFactorExpires = new Date()
            twoFactorExpires.setMinutes(twoFactorExpires.getMinutes() + 10) // 10 minutes

            await db
                .update(tables.users)
                .set({
                    twoFactorToken,
                    twoFactorExpires,
                    updatedAt: new Date()
                })
                .where(eq(tables.users.uuid, user.uuid))

            await sendTwoFactorEmail(user.email, twoFactorToken, user.name)

            // Log 2FA request
            // await db.insert(tables.auditLogs).values({
            //     uuid: crypto.randomUUID(),
            //     trialUuid: crypto.randomUUID(), // Temporary
            //     userUuid: user.uuid,
            //     action: 'View',
            //     entityType: 'User',
            //     entityUuid: user.uuid,
            //     timestamp: new Date(),
            //     ipAddress: getRequestIP(event),
            //     userAgent: getHeader(event, 'user-agent') || '',
            //     changes: {
            //         action: 'two_factor_requested',
            //         email: user.email
            //     },
            //     oldValues: null,
            //     newValues: null,
            //     sessionId: null,
            // })

            const response: ServerResponse<{ requiresTwoFactor: boolean; message: string }> = {
                status: 'success',
                statusCode: 200,
                statusText: 'OK',
                message: 'Two-factor authentication code sent to your email',
                data: {
                    requiresTwoFactor: true,
                    message: 'Please check your email for the authentication code'
                }
            }

            return response
        }

        // Generate magic link for passwordless login
        const magicLinkToken = generateSecureToken()
        const magicLinkExpires = new Date()
        magicLinkExpires.setMinutes(magicLinkExpires.getMinutes() + 15) // 15 minutes

        await db
            .update(tables.users)
            .set({
                magicLinkToken,
                magicLinkExpires,
                updatedAt: new Date()
            })
            .where(eq(tables.users.uuid, user.uuid))

        await sendMagicLinkEmail(user.email, magicLinkToken, user.role)

        // Log magic link request
        await db.insert(tables.auditLogs).values({
            uuid: crypto.randomUUID(),
            trialUuid: crypto.randomUUID(), // Temporary
            userUuid: user.uuid,
            action: 'View',
            entityType: 'User',
            entityUuid: user.uuid,
            timestamp: new Date(),
            ipAddress: getRequestIP(event),
            userAgent: getHeader(event, 'user-agent') || '',
            changes: {
                action: 'magic_link_requested',
                email: user.email
            },
            oldValues: null,
            newValues: null,
            sessionId: null,
        })

        const response: ServerResponse<{ requiresTwoFactor: boolean; message: string }> = {
            status: 'success',
            statusCode: 200,
            statusText: 'OK',
            message: 'Magic link sent to your email',
            data: {
                requiresTwoFactor: false,
                message: 'Please check your email for the sign-in link'
            }
        }

        return response

    } catch (error: unknown) {
        console.error('Login error:', error)

        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error during login'
        })
    }
})
