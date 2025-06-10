import { useStorage } from "#imports"
import type { Site } from "~/models/admin"
import type { ServerResponse } from "~/models/utils";

export default defineEventHandler(async () => {
    const storage = useStorage<Site>('sites')
    const ids = await storage.getKeys();

    if (!ids || ids.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No sites found'
        })
    }


    // Fetch all sites
    const sites = await Promise.all(ids.map(async (id) => {
        const site = await storage.getItem(id)
        return site
    }))

    const validSites = sites.filter((site) => site !== null && site !== undefined)
    if (validSites.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No valid sites found'
        })
    }

    const response: ServerResponse<Site[]> = {
        message: 'Sites fetched successfully',
        status: 'success',
        statusText: 'OK',
        statusCode: 200,
        data: validSites
    }

    return response
})
