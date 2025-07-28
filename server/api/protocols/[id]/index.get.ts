import type { Protocol } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"

export default defineEventHandler(async (event) => {
    const db = useDb()

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Protocol ID is required'
        })
    }
    const protocols = await db.select().from(tables.protocols).where(eq(tables.protocols.uuid, id)).limit(1)

    if (!protocols || protocols.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Protocol not found'
        })
    }

    const protocol = protocols[0]

    const response: ServerResponse<Protocol> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Protocol retrieved successfully',
        data: protocol
    }
    return response
})
