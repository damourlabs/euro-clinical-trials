import { useStorage } from "#imports"
import type { Site } from "~/models/admin";

import type { ServerResponse } from "~/models/utils"

// DELETE // Endpoint to delete a clinical trial by ID
export default defineEventHandler(async (event) => {
    const storage = useStorage<Site>('sites')
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Site ID is required'
        })
    }

    // Check if the site exists
    const existingSite = await storage.getItem(id)
    if (!existingSite) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Site not found'
        })
    }


    // Delete the site from storage
    await storage.removeItem(id)

    const response: ServerResponse<null> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Site deleted successfully',
        data: null
    }

    return response
});
