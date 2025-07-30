import type { Site } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"
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

    const { id } = data;

    const sites = await db.select().from(tables.sites).where(eq(tables.sites.uuid, id)).limit(1)

    if (!sites || sites.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Site not found'
        })
    }

    const site = sites[0]

    const response: ServerResponse<Site> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Site retrieved successfully',
        data: site
    }
    return response
})
