import { useStorage } from "#imports"
import type { Site } from "~/models/admin"
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

    const site = await storage.getItem(id)
    if (!site) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Site not found'
        })
    }


    const response: ServerResponse<Site> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Site retrieved successfully',
        data: site
    }
    return response
})
