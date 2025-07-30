import type { Site } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";

export default defineEventHandler(async () => {
  const db = useDb()
  const sitesTable = tables.sites

  // Fetch all sites
  const sites = await db.select().from(sitesTable).limit(100)

  if (sites.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No valid sites found'
    })
  }

  const response: ServerResponse<Site[]> = {
    message: 'Sites fetched successfully',
    status: 'success',
    statusText: 'OK',
    statusCode: 200,
    data: sites
  }

  return response
})
