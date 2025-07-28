import type { Trial } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"
import { z } from "zod"

export default defineEventHandler(async (event) => {
    const db = useDb()

    const { data, success, error } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Trial ID is required',
            data: error
        })
    }

    const { id } = data;

    const trials = await db.select().from(tables.trials).where(eq(tables.trials.uuid, id)).limit(1)

    if (!trials || trials.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Trial not found'
        })
    }

    const trial = trials[0]


    const response: ServerResponse<Trial> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Trial retrieved successfully',
        data: trial
    }
    return response
})
