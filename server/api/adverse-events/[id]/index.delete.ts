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
        const deletedAdverseEvent = await db.delete(adverseEventsTable)
            .where(eq(adverseEventsTable.uuid, adverseEventId))
            .returning()

        if (deletedAdverseEvent.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Adverse event not found'
            })
        }

        const response: ServerResponse<void> = {
            message: 'Adverse event deleted successfully',
            status: 'success',
            statusText: 'OK',
            statusCode: 200,
            data: undefined
        }

        return response
    } catch (error) {
        if (error.statusCode) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete adverse event',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
})
