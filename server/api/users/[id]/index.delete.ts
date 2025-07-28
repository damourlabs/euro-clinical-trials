import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle";
import { eq } from "drizzle-orm"

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

    // TODO: Implement role-based access control
    // Only admins can delete users
    // if (currentUser.role !== 'Admin') {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: 'Only administrators can delete users'
    //   })
    // }

    // Check if the user exists
    const query = await useDb().select().from(tables.users).where(eq(tables.users.uuid, id)).limit(1)
    const userExists = query.length > 0;

    console.log('Existing User:', userExists)

    if (!userExists) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found'
        })
    }

    // TODO: Add additional checks before deletion
    // - Check if user is referenced in trials, sites, etc.
    // - Consider soft delete instead of hard delete
    // - Add audit logging

    // Delete the user from database
    await useDb().delete(tables.users).where(eq(tables.users.uuid, id))

    const response: ServerResponse<null> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'User deleted successfully',
        data: null
    }

    return response
});
