import type { Patient } from "~/server/database/schema"
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
            statusMessage: 'Patient ID is required',
            data: error
        })
    }

    const { id } = data;

    const patients = await db.select().from(tables.patients).where(eq(tables.patients.uuid, id)).limit(1)

    if (!patients || patients.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Patient not found'
        })
    }

    const patient = patients[0]

    const response: ServerResponse<Patient> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Patient retrieved successfully',
        data: patient
    }
    return response
})
