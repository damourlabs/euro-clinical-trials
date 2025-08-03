import type { Visit } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb, tables, eq, desc } from "~/server/utils/drizzle"
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

    // First check if the patient exists
    const patients = await db.select().from(tables.patients).where(eq(tables.patients.uuid, patientUuid)).limit(1)

    if (!patients || patients.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Patient not found'
        })
    }

    // Get all visits for this patient
    const visits = await db
        .select()
        .from(tables.visits)
        .where(eq(tables.visits.patientUuid, patientUuid))
        .orderBy(desc(tables.visits.visitDate))

    const response: ServerResponse<Visit[]> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: `Found ${visits.length} visits for patient`,
        data: visits
    }

    return response
})
