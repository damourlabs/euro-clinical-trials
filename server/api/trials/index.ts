import type { Trial } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";

export default defineEventHandler(async () => {
  const db = useDb()
  const trialsTable = tables.trials

  // Fetch all trials
  const trials = await db.select().from(trialsTable).limit(100)

  if (trials.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No valid trials found'
    })
  }

  const response: ServerResponse<Trial[]> = {
    message: 'Trials fetched successfully',
    status: 'success',
    statusText: 'OK',
    statusCode: 200,
    data: trials
  }

  return response
})
