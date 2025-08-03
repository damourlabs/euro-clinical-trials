import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";
import * as tables from "~/server/database/schema";
import { isNuxtError } from "nuxt/app";

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
        if (!isNuxtError(error)) {
            throw createError({
                status: 500,
                statusMessage: 'Something went wrong',
                message: "Unknown error occured"
            })
        }

        throw error
    }
})
