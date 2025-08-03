import { trialSchema, type Trial } from "~/server/database/schema"
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
            statusMessage: 'Trial ID is required'
        })
    }

    const { id } = params


    const { success, error, data } = await readValidatedBody(event, trialSchema.safeParse)

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

    console.log('Creating trial with data:', data)

    // Save the new trial to storage
    await useDb().insert(tables.trials).values(
        {
            ...data
        }
    )


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
