
import { patientSchema, type Patient } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { z } from "zod";
import { useDb } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const { data: params } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!params) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Patient ID is required'
        })
    }

    const { success, error, data } = await readValidatedBody(event, patientSchema.safeParse)

    if (!success) {
        console.error('Invalid patient data:', error);
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid patient data',
            data: error
        })
    }

    if (!data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Patient data is required'
        })
    }

    // Save the new patient to database
    await useDb().insert(tables.patients).values({
        ...data
    })

    // Return the created patient
    const response: ServerResponse<Patient> = {
        status: 'success',
        statusCode: 201,
        statusText: 'Created',
        message: 'Patient created successfully',
        data: data
    }
    return response
})
