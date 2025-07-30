
import { sitesSchema, type Site } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { z } from "zod";
import { useDb } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const { data: params } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!params) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Site ID is required'
        })
    }

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

    console.log('Creating site with data:', data)

    // Save the new site to database
    await useDb().insert(tables.sites).values({
        ...data
    })

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
