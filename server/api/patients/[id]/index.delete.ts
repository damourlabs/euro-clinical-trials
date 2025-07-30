import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"

// DELETE // Endpoint to delete a clinical patient by ID
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

    if (!existingPatients || existingPatients.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Patient not found'
        })
    }

    // Delete the patient from database
    await useDb().delete(tables.patients).where(eq(tables.patients.uuid, id))

    const response: ServerResponse<null> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Patient deleted successfully',
        data: null
    }

    return response
});
