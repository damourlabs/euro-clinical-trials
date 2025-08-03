import type { Trial } from "~/server/database/schema"
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

    // Get the trial associated with this site
    const trials = await db.select().from(tables.trials).where(eq(tables.trials.uuid, site.trialUuid)).limit(1)

    if (!trials || trials.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Trial not found for this site'
        })
    }

    const trial = trials[0]

    const response: ServerResponse<Trial> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Trial retrieved successfully for site',
        data: trial
    }
    return response
})
