import type { User } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb, tables, eq } from "~/server/utils/drizzle"
import { z } from "zod"

export default defineEventHandler(async (event) => {
    const db = useDb()

    const { data, success, error } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Site ID is required',
            data: error
        })
    }

    const { id: siteUuid } = data;

    // First check if the site exists
    const sites = await db.select().from(tables.sites).where(eq(tables.sites.uuid, siteUuid)).limit(1)

    if (!sites || sites.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Site not found'
        })
    }

    const site = sites[0]

    // Study coordinator is optional, check if it exists
    if (!site.studyCoordinatorUuid) {
        const response: ServerResponse<User | null> = {
            status: 'success',
            statusCode: 200,
            statusText: 'OK',
            message: 'No study coordinator assigned to this site',
            data: null
        }
        return response
    }

    // Get the study coordinator associated with this site
    const users = await db.select().from(tables.users).where(eq(tables.users.uuid, site.studyCoordinatorUuid)).limit(1)

    if (!users || users.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Study coordinator not found for this site'
        })
    }

    const user = users[0]

    const response: ServerResponse<User> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Study coordinator retrieved successfully for site',
        data: user
    }
    return response
})
