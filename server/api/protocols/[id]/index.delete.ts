import type { Protocol } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { z } from "zod";
import { useDb } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const db = useDb()

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
    const query = await db.select().from(tables.protocols).where(eq(tables.protocols.uuid, id)).limit(1)

    if (!query || query.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Protocol not found'
        })
    }

    const protocol = query[0]

    console.log('Deleting protocol:', protocol)

    // Delete the protocol
    await db.delete(tables.protocols).where(eq(tables.protocols.uuid, id))

    const response: ServerResponse<Protocol> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Protocol deleted successfully',
        data: protocol
    }

    return response
})
