import { documentsSchema, type Document } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { z } from "zod";
import { useDb } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {

    const { data: params } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!params) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Document ID is required'
        })
    }

    const { id: _id } = params

    const { success, error, data } = await readValidatedBody(event, documentsSchema.safeParse)

    if (!success) {
        console.error('Invalid document data:', error);
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid document data',
            data: error
        })
    }

    if (!data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Document data is required'
        })
    }

    console.log('Creating document with data:', data)

    // Save the new document to storage
    await useDb().insert(tables.documents).values({
        ...data
    })

    // Return the created document
    const response: ServerResponse<Document> = {
        status: 'success',
        statusCode: 201,
        statusText: 'Created',
        message: 'Document created successfully',
        data: data
    }
    return response
})
