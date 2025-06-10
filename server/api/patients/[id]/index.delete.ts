import { useStorage } from "#imports"
import type { Patient } from "~/models/patients"
import type { ServerResponse } from "~/models/utils"

// DELETE // Endpoint to delete a clinical patient by ID
export default defineEventHandler(async (event) => {
    const storage = useStorage<Patient>('patients')
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Patient ID is required'
        })
    }

    // Check if the patient exists
    const existingPatient = await storage.getItem(id)
    if (!existingPatient) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Patient not found'
        })
    }


    // Delete the patient from storage
    await storage.removeItem(id)

    const response: ServerResponse<null> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Patient deleted successfully',
        data: null
    }

    return response
});
