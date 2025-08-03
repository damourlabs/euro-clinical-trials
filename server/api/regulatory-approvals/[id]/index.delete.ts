// DELETE // Endpoint to delete a regulatory approval
import type { ServerResponse } from "~/models/utils"
import { useDb } from "~/server/utils/drizzle"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Regulatory Approval ID is required'
        })
    }

    // Check if the regulatory approval exists
    const existingRegulatoryApprovals = await useDb().select().from(tables.regulatoryApprovals).where(eq(tables.regulatoryApprovals.uuid, id))

    if (!existingRegulatoryApprovals || existingRegulatoryApprovals.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Regulatory approval not found'
        })
    }

    // Delete the regulatory approval from the database
    await useDb().delete(tables.regulatoryApprovals).where(eq(tables.regulatoryApprovals.uuid, id))

    const response: ServerResponse<{ uuid: string }> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Regulatory approval deleted successfully',
        data: { uuid: id }
    }

    return response
})
