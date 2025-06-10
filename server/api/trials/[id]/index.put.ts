// PUT // Endpoint to update a trial
import { useStorage } from "#imports"
import { TrialSchema, type Trial } from "~/models/trials"
import type { ServerResponse } from "~/models/utils"

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

    // Get the updated data from the request body
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

    const newTrialData = {
        ...existingTrial,
        ...data,
        updatedAt: new Date() // Update the timestamp
    }

    // Update the trial in storage
    await storage.setItem(id, newTrialData)

    const response: ServerResponse<Trial> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Trial updated successfully',
        data: newTrialData
    }

    return response
})