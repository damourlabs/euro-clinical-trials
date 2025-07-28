// PUT // Endpoint to update a trial
import { TrialSchema, type Trial } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Trial ID is required'
        })
    }

    // Check if the trial exists
    const existingTrials = await useDb().select().from(tables.trials).where(eq(tables.trials.uuid, id))

    if (!existingTrials) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Trial not found'
        })
    }

    if (existingTrials.length > 1) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Multiple trials found with the same ID, this should not happen'
        })
    }

    // Get the existing trial data
    const existingTrial = existingTrials[0]

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
    await useDb().update(tables.trials)
        .set(newTrialData)
        .where(eq(tables.trials.uuid, id))

    const response: ServerResponse<Trial> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Trial updated successfully',
        data: newTrialData
    }

    return response
})