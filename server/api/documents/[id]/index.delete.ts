// DELETE // Endpoint to delete a document
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Document ID is required'
        })
    }

    // Check if the document exists
    const existingDocuments = await useDb().select().from(tables.documents).where(eq(tables.documents.uuid, id))

    if (!existingDocuments || existingDocuments.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Document not found'
        })
    }

    // Delete the document from the database
    await useDb().delete(tables.documents).where(eq(tables.documents.uuid, id))

    const response: ServerResponse<{ uuid: string }> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Document deleted successfully',
        data: { uuid: id }
    }

    return response
})
