// PUT // Endpoint to update a site
import { useStorage } from "#imports"
import { SiteSchema, type Site } from "~/models/admin"
import type { ServerResponse } from "~/models/utils"

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

    // Get the updated data from the request body
    const { success, error, data: updatedData } = await readValidatedBody(event, SiteSchema.safeParse)
    if (!success) {
        console.error('Invalid site data:', error);
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid site data',
            data: error
        })
    }

    if (!updatedData) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Site data is required'
        })
    }

    const newSiteData = {
        ...existingSite,
        ...updatedData
    }

    // Update the site in storage
    await storage.setItem(id, newSiteData)

    const response: ServerResponse<Site> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Site updated successfully',
        data: newSiteData
    }

    return response
})