import { protocolsSchema, type Protocol } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {

    // Protocol creation doesn't need an ID parameter since UUID is auto-generated

    const { success, error, data } = await readValidatedBody(event, protocolsSchema.safeParse)

    if (!success) {
        console.error('Invalid protocol data:', error);
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid protocol data',
            data: error
        })
    }

    if (!data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Protocol data is required'
        })
    }

    console.log('Creating protocol with data:', data)

    // Save the new protocol to storage
    await useDb().insert(tables.protocols).values(
        {
            ...data
        }
    )

    // Return the created protocol
    const response: ServerResponse<Protocol> = {
        status: 'success',
        statusCode: 201,
        statusText: 'Created',
        message: 'Protocol created successfully',
        data: data as Protocol
    }

    return response
})
