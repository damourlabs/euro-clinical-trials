// PUT // Endpoint to update a patient
import { useStorage } from "#imports"
import { PatientSchema, type Patient } from "~/models/patients"
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

    // Check if the patient exists
    const existingPatient = await storage.getItem(id)
    if (!existingPatient) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Patient not found'
        })
    }

    // Get the updated data from the request body
    const { success, error, data: updatedData } = await readValidatedBody(event, PatientSchema.safeParse)
    if (!success) {
        console.error('Invalid patient data:', error);
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid patient data',
            data: error
        })
    }

    if (!updatedData) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Patient data is required'
        })
    }

    const newPatientData = {
        ...existingPatient,
        ...updatedData
    }

    // Update the patient in storage
    await storage.setItem(id, newPatientData)

    const response: ServerResponse<Patient> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Patient updated successfully',
        data: newPatientData
    }

    return response
})