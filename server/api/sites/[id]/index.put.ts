// PUT // Endpoint to update a site
import { sitesSchema, type Site } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"

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

    if (!existingSites) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Site not found'
        })
    }

    if (existingSites.length > 1) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Multiple sites found with the same ID, this should not happen'
        })
    }

    // Get the existing site data
    const existingSite = existingSites[0]

    // Get the updated data from the request body
    const { success, error, data } = await readValidatedBody(event, sitesSchema.safeParse)

    if (!success) {
        console.error('Invalid site data:', error);
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid site data',
            data: error
        })
    }

    if (!data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Site data is required'
        })
    }

    const newSiteData = {
        ...existingSite,
        ...data,
        updatedAt: new Date() // Update the timestamp
    }

    // Update the site in database
    await useDb().update(tables.sites).set(newSiteData).where(eq(tables.sites.uuid, id))

    const response: ServerResponse<Site> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Site updated successfully',
        data: newSiteData
    }

    return response
})