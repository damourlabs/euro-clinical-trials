import { useDb } from '~/server/utils/drizzle'
import { eq } from 'drizzle-orm'
import { generateTokens } from '~/server/utils/jwt'
import type { User } from '~/server/database/schema'

export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true
    },
    async onSuccess(event, { user }) {
        const db = useDb()

        try {
            // Find or create user
            const existingUsers = await db
                .select()
                .from(tables.users)
                .where(eq(tables.users.githubId, user.id.toString()))
                .limit(1)

            let dbUser

            if (!user.email) {
                // If email is not provided, we set a default 
                user.email = `${user.login}@github.com`
            }

            if (existingUsers.length === 0) {

                // Check if user exists with same email
                const emailUsers = await db
                    .select()
                    .from(tables.users)
                    .where(eq(tables.users.email, user.email))
                    .limit(1)

                if (emailUsers.length > 0) {
                    // Link GitHub account to existing user
                    dbUser = emailUsers[0]
                    await db
                        .update(tables.users)
                        .set({
                            githubId: user.id.toString(),
                            emailVerified: true, // GitHub emails are verified
                            lastLoginAt: new Date(),
                            updatedAt: new Date()
                        })
                        .where(eq(tables.users.uuid, dbUser.uuid))
                } else {
                    // 

                    // Create new user
                    const newUser: User = {
                        uuid: crypto.randomUUID(),
                        email: user.email || '',
                        name: user.name || user.login,
                        phoneNumber: null,
                        institution: 'GitHub OAuth',
                        role: 'Patient',
                        isActive: true,
                        emailVerified: true,
                        githubId: user.id.toString(),
                        gdprConsentGiven: true, // Assume consent for OAuth
                        gdprConsentDate: new Date(),
                        twoFactorEnabled: false,
                        loginAttempts: 0,
                        lastLoginAt: new Date(),
                        emailVerificationToken: null,
                        emailVerificationExpires: null,
                        magicLinkToken: null,
                        magicLinkExpires: null,
                        twoFactorSecret: null,
                        twoFactorToken: null,
                        twoFactorExpires: null,
                        accountLockedUntil: null,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }

                    await db.insert(tables.users).values(newUser)
                    dbUser = newUser
                }
            } else {
                dbUser = existingUsers[0]
                // Update last login
                await db
                    .update(tables.users)
                    .set({
                        lastLoginAt: new Date(),
                        updatedAt: new Date()
                    })
                    .where(eq(tables.users.uuid, dbUser.uuid))
            }

            // Generate JWT tokens
            const jwtTokens = generateTokens({
                uuid: dbUser.uuid,
                email: dbUser.email,
                role: dbUser.role
            })

            // Set authentication cookies
            setCookie(event, 'auth-token', jwtTokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/'
            })

            // Also set the nuxt-auth-utils session for compatibility
            await setUserSession(event, {
                user: {
                    id: dbUser.uuid,
                    githubId: user.id
                }
            })

            // Log OAuth login
            // await db.insert(tables.auditLogs).values({
            //     uuid: crypto.randomUUID(),
            //     trialUuid: crypto.randomUUID(), // Temporary
            //     userUuid: dbUser.uuid,
            //     action: 'View',
            //     entityType: 'User',
            //     entityUuid: dbUser.uuid,
            //     timestamp: new Date(),
            //     ipAddress: getRequestIP(event),
            //     userAgent: getHeader(event, 'user-agent') || '',
            //     changes: {
            //         action: 'github_oauth_login',
            //         email: dbUser.email,
            //         githubId: user.id
            //     },
            //     oldValues: null,
            //     newValues: null,
            //     sessionId: null,
            // })

        } catch (error) {
            console.error('GitHub OAuth database error:', error)
            // Continue with basic session for now
            await setUserSession(event, {
                user: {
                    id: user.id.toString(),
                    githubId: user.id
                }
            })
        }

        return sendRedirect(event, '/')
    },
    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/auth/login?error=oauth_failed')
    },
})