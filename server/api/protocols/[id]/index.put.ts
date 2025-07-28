import { protocolsSchema, type Protocol } from "~/server/database/schema"
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
            statusMessage: 'Protocol ID is required'
        })
    }

    const { id } = params

    // Check if protocol exists
    const existingProtocols = await useDb().select().from(tables.protocols).where(eq(tables.protocols.uuid, id)).limit(1)

    if (!existingProtocols || existingProtocols.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Protocol not found'
        })
    }

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

    console.log('Updating protocol with data:', data)

    // Update the protocol
    await useDb().update(tables.protocols)
        .set({
            ...data,
            uuid: id // Ensure the UUID remains the same
        })
        .where(eq(tables.protocols.uuid, id))

    // Return the updated protocol
    const response: ServerResponse<Protocol> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Protocol updated successfully',
        data: { ...data, uuid: id } as Protocol
    }

    return response
})
