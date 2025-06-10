import { useStorage } from "#imports"
import type { Trial } from "~/models/trials"
import type { ServerResponse } from "~/models/utils"

// DELETE // Endpoint to delete a clinical trial by ID
export default defineEventHandler(async (event) => {
    const storage = useStorage<Trial>('trials')
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Trial ID is required'
        })
    }

    // Check if the trial exists
    const existingTrial = await storage.getItem(id)
    if (!existingTrial) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Trial not found'
        })
    }

    // Delete the trial from storage
    await storage.removeItem(id)


    const response: ServerResponse<null> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Trial deleted successfully',
        data: null
    }

    return response
});
