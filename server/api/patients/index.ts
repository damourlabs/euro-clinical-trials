import { useStorage } from "#imports"
import type { Patient } from "~/models/patients"
import type { ServerResponse } from "~/models/utils";

export default defineEventHandler(async () => {
    const storage = useStorage<Patient>('patients')
    const ids = await storage.getKeys();

    if (!ids || ids.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No patients found'
        })
    }


    // Fetch all patients
    const patients = await Promise.all(ids.map(async (id) => {
        const patient = await storage.getItem(id)
        return patient
    }))

    const validPatients = patients.filter((patient) => patient !== null && patient !== undefined)
    if (validPatients.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No valid patients found'
        })
    }

    const response: ServerResponse<Patient[]> = {
        message: 'Patients fetched successfully',
        status: 'success',
        statusText: 'OK',
        statusCode: 200,
        data: validPatients
    }

    return response
})
