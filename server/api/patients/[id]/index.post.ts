
import { useStorage } from "#imports"
import type { ServerResponse } from "~/models/utils"
import { z } from "zod";
import type { Patient } from "~/models/patients";
import { PatientSchema } from "~/models/patients";
export default defineEventHandler(async (event) => {
    const storage = useStorage<Patient>('patients')
    // Generate a unique patient ID
    const { data: params } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!params) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Patient ID is required'
        })
    }

    const { id } = params
    const { success, error, data } = await readValidatedBody(event, PatientSchema.safeParse)

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

    // Save the new patient to storage
    await storage.setItem(id, data)
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
