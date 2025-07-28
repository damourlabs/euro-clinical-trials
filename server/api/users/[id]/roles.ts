import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"
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

    // TODO: Implement access control
    // Only admins and coordinators can manage user roles
    // if (!['Admin', 'Coordinator'].includes(currentUser.role)) {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: 'Insufficient permissions to view user roles'
    //   })
    // }

    const db = useDb()

    // Check if user exists
    const userExists = await db.select().from(tables.users).where(eq(tables.users.uuid, id)).limit(1)
    if (userExists.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found'
        })
    }

    // Get user roles with trial and site information
    const userRoles = await db.select({
        uuid: tables.userRoles.uuid,
        role: tables.userRoles.role,
        trialUuid: tables.userRoles.trialUuid,
        siteUuid: tables.userRoles.siteUuid,
        createdAt: tables.userRoles.createdAt,
        updatedAt: tables.userRoles.updatedAt,
        trialTitle: tables.trials.title,
        siteName: tables.sites.name
    })
        .from(tables.userRoles)
        .leftJoin(tables.trials, eq(tables.userRoles.trialUuid, tables.trials.uuid))
        .leftJoin(tables.sites, eq(tables.userRoles.siteUuid, tables.sites.uuid))
        .where(eq(tables.userRoles.userUuid, id))

    const response: ServerResponse<typeof userRoles> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'User roles retrieved successfully',
        data: userRoles
    }

    return response
})
