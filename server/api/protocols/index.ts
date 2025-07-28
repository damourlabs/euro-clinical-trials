import type { Protocol } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";

export default defineEventHandler(async () => {
    const db = useDb()
    const protocolsTable = tables.protocols

    // Fetch all protocols
    const protocols = await db.select().from(protocolsTable).limit(100)

    if (protocols.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No valid protocols found'
        })
    }

    const response: ServerResponse<Protocol[]> = {
        message: 'Protocols fetched successfully',
        status: 'success',
        statusText: 'OK',
        statusCode: 200,
        data: protocols
    }

    return response
})
