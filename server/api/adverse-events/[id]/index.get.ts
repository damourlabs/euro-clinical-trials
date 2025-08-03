import type { AdverseEvent } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";
import * as tables from "~/server/database/schema";

export default defineEventHandler(async (event) => {
    const db = useDb()
    const adverseEventsTable = tables.adverseEvents

    const adverseEventId = getRouterParam(event, 'id')

    if (!adverseEventId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Adverse event ID is required'
        })
    }

    try {
        const adverseEvent = await db.select()
            .from(adverseEventsTable)
            .where(eq(adverseEventsTable.uuid, adverseEventId))
            .limit(1)

        if (adverseEvent.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Adverse event not found'
            })
        }

        const response: ServerResponse<AdverseEvent> = {
            message: 'Adverse event fetched successfully',
            status: 'success',
            statusText: 'OK',
            statusCode: 200,
            data: adverseEvent[0]
        }

        return response
    } catch (error) {
        if (error.statusCode) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch adverse event',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
})
