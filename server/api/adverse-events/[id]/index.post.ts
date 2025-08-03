import type { AdverseEvent } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";
import * as tables from "~/server/database/schema";

export default defineEventHandler(async (event) => {
    const db = useDb()
    const adverseEventsTable = tables.adverseEvents

    const body = await readBody(event)

    try {
        const newAdverseEvent = await db.insert(adverseEventsTable)
            .values({
                ...body,
                dateOccurred: body.dateOccurred ? new Date(body.dateOccurred) : new Date(),
                reportedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .returning()

        const response: ServerResponse<AdverseEvent> = {
            message: 'Adverse event created successfully',
            status: 'success',
            statusText: 'Created',
            statusCode: 201,
            data: newAdverseEvent[0]
        }

        return response
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create adverse event',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
})
