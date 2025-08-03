import type { Site } from "~/server/database/schema"
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

    // First get the patient to find the site UUID
    const patients = await db.select().from(tables.patients).where(eq(tables.patients.uuid, patientUuid)).limit(1)

    if (!patients || patients.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Patient not found'
        })
    }

    const patient = patients[0]

    // Get the site details
    const sites = await db
        .select()
        .from(tables.sites)
        .where(eq(tables.sites.uuid, patient.siteUuid))
        .limit(1)

    if (!sites || sites.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Site not found for this patient'
        })
    }

    const response: ServerResponse<Site> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: `Found site for patient`,
        data: sites[0]
    }

    return response
})
