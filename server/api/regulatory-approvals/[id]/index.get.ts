import type { RegulatoryApproval } from "~/server/database/schema"
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
            statusMessage: 'Regulatory Approval ID is required',
            data: error
        })
    }

    const { id } = data;

    const regulatoryApprovals = await db.select().from(tables.regulatoryApprovals).where(eq(tables.regulatoryApprovals.uuid, id)).limit(1)

    if (!regulatoryApprovals || regulatoryApprovals.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Regulatory approval not found'
        })
    }

    const regulatoryApproval = regulatoryApprovals[0]

    const response: ServerResponse<RegulatoryApproval> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Regulatory approval retrieved successfully',
        data: regulatoryApproval
    }
    return response
})
