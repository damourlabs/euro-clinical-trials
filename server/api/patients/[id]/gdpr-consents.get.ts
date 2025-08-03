import type { GdprConsent } from "~/server/database/schema"
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

    // Get all GDPR consents for this patient
    const gdprConsents = await db
        .select()
        .from(tables.gdprConsents)
        .where(eq(tables.gdprConsents.patientUuid, patientUuid))
        .orderBy(desc(tables.gdprConsents.consentDate))

    const response: ServerResponse<GdprConsent[]> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: `Found ${gdprConsents.length} GDPR consents for patient`,
        data: gdprConsents
    }

    return response
})
