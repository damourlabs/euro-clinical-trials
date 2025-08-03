import type { RegulatoryApproval } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb, tables, eq } from "~/server/utils/drizzle"
import { z } from "zod"

export default defineEventHandler(async (event) => {
    const db = useDb()

    const { data, success, error } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Trial ID is required',
            data: error
        })
    }

    const { id } = data

    // First verify trial exists
    const trial = await db.select().from(tables.trials).where(eq(tables.trials.uuid, id)).limit(1)

    if (!trial || trial.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Trial not found'
        })
    }

    // Get all regulatory approvals for this trial
    const approvals = await db.select().from(tables.regulatoryApprovals).where(eq(tables.regulatoryApprovals.trialUuid, id))

    const response: ServerResponse<RegulatoryApproval[]> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Trial regulatory approvals retrieved successfully',
        data: approvals
    }

    return response
})
