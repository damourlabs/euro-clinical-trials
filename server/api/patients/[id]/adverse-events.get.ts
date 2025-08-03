import type { AdverseEvent } from "~/server/database/schema"
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

    // Get all adverse events for this patient
    const adverseEvents = await db
        .select()
        .from(tables.adverseEvents)
        .where(eq(tables.adverseEvents.patientUuid, patientUuid))
        .orderBy(desc(tables.adverseEvents.eventDate))

    const response: ServerResponse<AdverseEvent[]> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: `Found ${adverseEvents.length} adverse events for patient`,
        data: adverseEvents
    }

    return response
})
