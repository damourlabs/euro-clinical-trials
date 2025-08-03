import type { Document } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";

export default defineEventHandler(async () => {
  const db = useDb()
  const documentsTable = tables.documents

  // Fetch all documents
  const documents = await db.select().from(documentsTable).limit(100)

  if (documents.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No valid documents found'
    })
  }

  const response: ServerResponse<Document[]> = {
    message: 'Documents fetched successfully',
    status: 'success',
    statusText: 'OK',
    statusCode: 200,
    data: documents
  }

  return response
})
