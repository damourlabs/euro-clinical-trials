import { useStorage } from "#imports"
import type { Patient } from "~/models/patients"
import type { ServerResponse } from "~/models/utils"

export default defineEventHandler(async (event) => {
    const storage = useStorage<Patient>('patients')

    const id = getRouterParam(event, 'id')


    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Patient ID is required'
        })
    }

    const patient = await storage.getItem(id)
    if (!patient) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Patient not found'
        })
    }


    const response: ServerResponse<Patient> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Patient retrieved successfully',
        data: patient
    }
    return response
})
