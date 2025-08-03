import type { StudyDesign } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb, tables, eq } from "~/server/utils/drizzle"
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

    const { id } = data

    // First verify trial exists
    const trial = await db.select().from(tables.trials).where(eq(tables.trials.uuid, id)).limit(1)

    if (!trial || trial.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Trial not found'
        })
    }

    // Get study design for this trial
    const studyDesigns = await db.select().from(tables.studyDesigns).where(eq(tables.studyDesigns.trialUuid, id)).limit(1)

    const response: ServerResponse<StudyDesign | null> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Trial study design retrieved successfully',
        data: studyDesigns.length > 0 ? studyDesigns[0] : null
    }

    return response
})
