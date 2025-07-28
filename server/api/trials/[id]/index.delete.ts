import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle";

// DELETE // Endpoint to delete a clinical trial by ID
export default defineEventHandler(async (event) => {
    const db = useDb()
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Trial ID is required'
        })
    }

    // Check if the trial exists
    //  currently drizzle doesnt allow for SELECT EXISTS
    // https://www.answeroverflow.com/m/1187887664398094357
    const query = await db.select().from(tables.trials).where(eq(tables.trials.uuid, id)).limit(1)
    const trialExists = query.length > 0;

    if (!trialExists) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Trial not found'
        })
    }

    // Delete the trial from storage
    await db.delete(tables.trials).where(eq(tables.trials.uuid, id))

    const response: ServerResponse<null> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Trial deleted successfully',
        data: null
    }

    return response
});
