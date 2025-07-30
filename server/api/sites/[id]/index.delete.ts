import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"

// DELETE // Endpoint to delete a clinical trial site by ID
export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Site ID is required'
        })
    }

    // Check if the site exists
    const existingSites = await useDb().select().from(tables.sites).where(eq(tables.sites.uuid, id))

    if (!existingSites || existingSites.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Site not found'
        })
    }

    // Delete the site from database
    await useDb().delete(tables.sites).where(eq(tables.sites.uuid, id))

    const response: ServerResponse<null> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Site deleted successfully',
        data: null
    }

    return response
});
