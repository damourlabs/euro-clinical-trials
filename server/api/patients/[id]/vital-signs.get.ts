import type { VitalSigns } from "~/server/database/schema"
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

    // Get all vital signs for this patient
    const vitalSigns = await db
        .select()
        .from(tables.vitalSigns)
        .where(eq(tables.vitalSigns.patientUuid, patientUuid))
        .orderBy(desc(tables.vitalSigns.recordedAt))

    const response: ServerResponse<VitalSigns[]> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: `Found ${vitalSigns.length} vital signs records for patient`,
        data: vitalSigns
    }

    return response
})
