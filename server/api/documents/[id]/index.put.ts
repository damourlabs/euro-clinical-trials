// PUT // Endpoint to update a document
import { documentsSchema, type Document } from "~/server/database/schema"
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

    if (!existingDocuments) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Document not found'
        })
    }

    if (existingDocuments.length > 1) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Multiple documents found with the same ID, this should not happen'
        })
    }

    // Get the existing document data
    const existingDocument = existingDocuments[0]

    // Read and validate the updated data
    const body = await readBody(event)

    // Merge existing data with new data
    const updatedData = {
        ...existingDocument,
        ...body
    }

    // Validate the merged data
    const validationResult = documentsSchema.safeParse(updatedData)

    if (!validationResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid document data',
            data: validationResult.error
        })
    }

    const validatedData = validationResult.data

    // Update the document in the database
    const [updatedDocument] = await useDb()
        .update(tables.documents)
        .set(validatedData)
        .where(eq(tables.documents.uuid, id))
        .returning()

    if (!updatedDocument) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update document'
        })
    }

    const response: ServerResponse<Document> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Document updated successfully',
        data: updatedDocument
    }

    return response
})
