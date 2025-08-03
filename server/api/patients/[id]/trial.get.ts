import type { Trial } from "~/server/database/schema"
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
            statusMessage: 'Patient ID is required',
            data: error
        })
    }

    const { id: patientUuid } = data;

    // First get the patient to find the trial UUID
    const patients = await db.select().from(tables.patients).where(eq(tables.patients.uuid, patientUuid)).limit(1)

    if (!patients || patients.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Patient not found'
        })
    }

    const patient = patients[0]

    // Get the trial details
    const trials = await db
        .select()
        .from(tables.trials)
        .where(eq(tables.trials.uuid, patient.trialUuid))
        .limit(1)

    if (!trials || trials.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Trial not found for this patient'
        })
    }

    const response: ServerResponse<Trial> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: `Found trial for patient`,
        data: trials[0]
    }

    return response
})
