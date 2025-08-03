import { z } from 'zod'
import { useDb } from '~/server/utils/drizzle'
import { generateTokens } from '~/server/utils/jwt'
import { eq } from 'drizzle-orm'
import type { ServerResponse } from '~/models/utils'
import type { AuthUser } from '~/stores/auth'

// Verification schema
const VerifySchema = z.object({
    token: z.string().min(1, 'Token is required'),
    email: z.string().email('Valid email is required'),
    twoFactorCode: z.string().optional() // For 2FA verification
})

export default defineEventHandler(async (event) => {
    if (event.method !== "POST") {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        })
    }

    const db = useDb()

    // Validate request body
    const { success, error, data } = await readValidatedBody(event, VerifySchema.safeParse)

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

        // Handle two-factor authentication verification
        if (data.twoFactorCode) {
            if (!user.twoFactorToken || !user.twoFactorExpires) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'No two-factor authentication code was requested'
                })
            }

            if (user.twoFactorExpires < new Date()) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Two-factor authentication code has expired'
                })
            }

            if (user.twoFactorToken !== data.twoFactorCode) {
                // Increment failed login attempts
                await db
                    .update(tables.users)
                    .set({
                        loginAttempts: user.loginAttempts + 1,
                        accountLockedUntil: user.loginAttempts >= 4 ? new Date(Date.now() + 30 * 60 * 1000) : null, // Lock for 30 minutes after 5 failed attempts
                        updatedAt: new Date()
                    })
                    .where(eq(tables.users.uuid, user.uuid))

                throw createError({
                    statusCode: 401,
                    statusMessage: 'Invalid two-factor authentication code'
                })
            }

            // Clear 2FA data and login attempts on successful verification
            await db
                .update(tables.users)
                .set({
                    twoFactorToken: null,
                    twoFactorExpires: null,
                    loginAttempts: 0,
                    accountLockedUntil: null,
                    lastLoginAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(tables.users.uuid, user.uuid))
        } else {
            // Handle magic link verification
            if (!user.magicLinkToken || !user.magicLinkExpires) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'No magic link was requested'
                })
            }

            if (user.magicLinkExpires < new Date()) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Magic link has expired'
                })
            }

            if (user.magicLinkToken !== data.token) {
                throw createError({
                    statusCode: 401,
                    statusMessage: 'Invalid or expired magic link'
                })
            }

            // Clear magic link data on successful verification
            await db
                .update(tables.users)
                .set({
                    magicLinkToken: null,
                    magicLinkExpires: null,
                    loginAttempts: 0,
                    accountLockedUntil: null,
                    lastLoginAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(tables.users.uuid, user.uuid))
        }

        // Generate JWT tokens
        const tokens = generateTokens({
            uuid: user.uuid,
            email: user.email,
            role: user.role
        })

        // Log successful authentication
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
        //         action: data.twoFactorCode ? 'two_factor_login' : 'magic_link_login',
        //         email: user.email
        //     },
        //     oldValues: null,
        //     newValues: null,
        //     sessionId: null,
        // })

        // Set authentication cookie
        setCookie(event, 'auth-token', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        })

        // Set refresh token cookie
        setCookie(event, 'refresh-token', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
        })

        const response: ServerResponse<{
            user: AuthUser,
            tokens: {
                accessToken: string
                expiresAt: Date
            }
        }> = {
            status: 'success',
            statusCode: 200,
            statusText: 'OK',
            message: 'Authentication successful',
            data: {
                user: {
                    uuid: user.uuid,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    institution: user.institution,
                    emailVerified: user.emailVerified,
                    twoFactorEnabled: user.twoFactorEnabled,
                },
                tokens: {
                    accessToken: tokens.accessToken,
                    expiresAt: tokens.expiresAt
                }
            }
        }

        return response

    } catch (error: unknown) {
        console.error('Verification error:', error)

        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error during verification'
        })
    }
})
