import type { AdverseEvent } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";
import * as tables from "~/server/database/schema";

export default defineEventHandler(async () => {
    const db = useDb()
    const adverseEventsTable = tables.adverseEvents

    // Fetch all adverse events
    const adverseEvents = await db.select().from(adverseEventsTable).limit(100)

    if (adverseEvents.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No valid adverse events found'
        })
    }

    const response: ServerResponse<AdverseEvent[]> = {
        message: 'Adverse events fetched successfully',
        status: 'success',
        statusText: 'OK',
        statusCode: 200,
        data: adverseEvents
    }

    return response
})
