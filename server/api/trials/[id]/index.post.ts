import { TrialSchema } from "~/models/trials";
import { useStorage } from "#imports"
import type { Trial } from "~/models/trials"
import type { ServerResponse } from "~/models/utils"
import { z } from "zod";
export default defineEventHandler(async (event) => {
    const storage = useStorage<Trial>('trials')
    // Generate a unique trial ID
    const { data: params } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!params) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Trial ID is required'
        })
    }

    const { id } = params


    const { success, error, data } = await readValidatedBody(event, TrialSchema.safeParse)

    if (!success) {
        console.error('Invalid trial data:', error);
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid trial data',
            data: error
        })
    }

    if (!data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Trial data is required'
        })
    }

    // Save the new trial to storage
    await storage.setItem(id, data)
    // Return the created trial
    const response: ServerResponse<Trial> = {
        status: 'success',
        statusCode: 201,
        statusText: 'Created',
        message: 'Trial created successfully',
        data: data
    }
    return response

})
