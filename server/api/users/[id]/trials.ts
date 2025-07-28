import type { Trial } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"
import { eq, or } from "drizzle-orm"

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
    // Users can view their own trials, admins/coordinators/monitors can view any user's trials
    // if (currentUser.uuid !== id && !['Admin', 'Coordinator', 'Monitor'].includes(currentUser.role)) {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: 'Insufficient permissions to view this user\'s trials'
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

    // Get trials where user is either sponsor or principal investigator
    const trials = await db.select()
        .from(tables.trials)
        .where(
            or(
                eq(tables.trials.sponsorUuid, id),
                eq(tables.trials.principalInvestigatorUuid, id)
            )
        )

    const response: ServerResponse<Trial[]> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'User trials retrieved successfully',
        data: trials
    }

    return response
})
