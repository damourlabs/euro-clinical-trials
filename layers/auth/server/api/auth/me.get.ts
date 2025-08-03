import { requireAuth } from '~/server/utils/auth'
import type { ServerResponse } from '~/models/utils'

export default defineEventHandler(async (event) => {
    if (event.method !== 'GET') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        })
    }

    try {
        // Get authenticated user
        const user = await requireAuth(event)

        const response: ServerResponse<{
            uuid: string
            email: string
            name: string
            role: string
            institution: string
            emailVerified: boolean
            twoFactorEnabled: boolean
            lastLoginAt: Date | null
        }> = {
            status: 'success',
            statusCode: 200,
            statusText: 'OK',
            message: 'User data retrieved successfully',
            data: {
                uuid: user.uuid,
                email: user.email,
                name: user.name,
                role: user.role,
                institution: user.institution,
                emailVerified: user.emailVerified,
                twoFactorEnabled: user.twoFactorEnabled,
                lastLoginAt: user.lastLoginAt
            }
        }

        return response

    } catch (error: unknown) {
        console.error('Get user error:', error)

        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error'
        })
    }
})
