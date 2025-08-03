// PUT // Endpoint to update a patient
import { patientSchema, type Patient } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Patient ID is required'
        })
    }

    // Check if the patient exists
    const existingPatients = await useDb().select().from(tables.patients).where(eq(tables.patients.uuid, id))

    if (!existingPatients) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Patient not found'
        })
    }

    if (existingPatients.length > 1) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Multiple patients found with the same ID, this should not happen'
        })
    }

    // Get the existing patient data
    const existingPatient = existingPatients[0]

    // Get the updated data from the request body
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

    const newPatientData = {
        ...existingPatient,
        ...data,
        updatedAt: new Date() // Update the timestamp
    }

    // Update the patient in database
    await useDb().update(tables.patients).set(newPatientData).where(eq(tables.patients.uuid, id))

    const response: ServerResponse<Patient> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Patient updated successfully',
        data: newPatientData
    }

    return response
})