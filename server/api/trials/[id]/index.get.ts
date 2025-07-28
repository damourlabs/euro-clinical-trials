import { useStorage } from "#imports"
import type { Trial } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"
import { QueryBuilder } from "drizzle-orm/pg-core"

export default defineEventHandler(async (event) => {
    const db = useDb()

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Trial ID is required'
        })
    }
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
