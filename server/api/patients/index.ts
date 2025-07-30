import type { Patient } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb, tables } from "~/server/utils/drizzle";

export default defineEventHandler(async () => {
    const db = useDb()
    const patientsTable = tables.patients

    // Fetch all patients
    const patients = await db.select().from(patientsTable).limit(100)

    if (patients.length === 0) {
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
        data: patients
    }

    return response
})
