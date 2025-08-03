import type { Document } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"
import { z } from "zod"

export default defineEventHandler(async (event) => {
    const db = useDb()

    const { data, success, error } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Document ID is required',
            data: error
        })
    }

    const { id } = data;

    const documents = await db.select().from(tables.documents).where(eq(tables.documents.uuid, id)).limit(1)

    if (!documents || documents.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Document not found'
        })
    }

    const document = documents[0]

    const response: ServerResponse<Document> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Document retrieved successfully',
        data: document
    }
    return response
})
