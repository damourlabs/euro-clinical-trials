// PUT // Endpoint to update a regulatory approval
import { regulatoryApprovalsSchema, type RegulatoryApproval } from "~/server/database/schema"
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

    if (!existingRegulatoryApprovals) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Regulatory approval not found'
        })
    }

    if (existingRegulatoryApprovals.length > 1) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Multiple regulatory approvals found with the same ID, this should not happen'
        })
    }

    // Get the existing regulatory approval data
    const existingRegulatoryApproval = existingRegulatoryApprovals[0]

    // Read and validate the updated data
    const body = await readBody(event)

    // Merge existing data with new data
    const updatedData = {
        ...existingRegulatoryApproval,
        ...body
    }

    // Validate the merged data
    const validationResult = regulatoryApprovalsSchema.safeParse(updatedData)

    if (!validationResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid regulatory approval data',
            data: validationResult.error
        })
    }

    const validatedData = validationResult.data

    // Update the regulatory approval in the database
    const [updatedRegulatoryApproval] = await useDb()
        .update(tables.regulatoryApprovals)
        .set(validatedData)
        .where(eq(tables.regulatoryApprovals.uuid, id))
        .returning()

    if (!updatedRegulatoryApproval) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update regulatory approval'
        })
    }

    const response: ServerResponse<RegulatoryApproval> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: 'Regulatory approval updated successfully',
        data: updatedRegulatoryApproval
    }

    return response
})
