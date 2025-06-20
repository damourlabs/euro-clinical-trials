
import { useStorage } from "#imports"
import type { ServerResponse } from "~/models/utils"
import { z } from "zod";
import type { Site } from "~/models/admin";
import { SiteSchema } from "~/models/admin";
export default defineEventHandler(async (event) => {
    const storage = useStorage<Site>('sites')
    // Generate a unique site ID
    const { data: params } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!params) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Site ID is required'
        })
    }

    const { id } = params
    const { success, error, data } = await readValidatedBody(event, SiteSchema.safeParse)

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

    // Save the new site to storage
    await storage.setItem(id, data)
    // Return the created site
    const response: ServerResponse<Site> = {
        status: 'success',
        statusCode: 201,
        statusText: 'Created',
        message: 'Site created successfully',
        data: data
    }
    return response

})
