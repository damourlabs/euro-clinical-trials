import type { ServerResponse } from '~/models/utils'

export default defineEventHandler(async (event) => {
    if (getMethod(event) !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        })
    }

    try {
        // Clear authentication cookies
        setCookie(event, 'auth-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Expire immediately
            path: '/'
        })

        setCookie(event, 'refresh-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Expire immediately
            path: '/'
        })

        // Also clear the nuxt-auth-utils session if it exists
        await clearUserSession(event)

        const response: ServerResponse<{ message: string }> = {
            status: 'success',
            statusCode: 200,
            statusText: 'OK',
            message: 'Logout successful',
            data: {
                message: 'You have been successfully logged out'
            }
        }

        return response

    } catch (error: unknown) {
        console.error('Logout error:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error during logout'
        })
    }
})
