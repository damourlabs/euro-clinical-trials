import type { RegulatoryApproval } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";

export default defineEventHandler(async () => {
  const db = useDb()
  const regulatoryApprovalsTable = tables.regulatoryApprovals

  // Fetch all regulatory approvals
  const regulatoryApprovals = await db.select().from(regulatoryApprovalsTable).limit(100)

  if (regulatoryApprovals.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No valid regulatory approvals found'
    })
  }

  const response: ServerResponse<RegulatoryApproval[]> = {
    message: 'Regulatory approvals fetched successfully',
    status: 'success',
    statusText: 'OK',
    statusCode: 200,
    data: regulatoryApprovals
  }

  return response
})
