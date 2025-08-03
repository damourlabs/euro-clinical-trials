import { regulatoryApprovalsSchema, type RegulatoryApproval } from "~/server/database/schema"
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
            statusMessage: 'Regulatory Approval ID is required'
        })
    }

    const { id: _id } = params

    const { success, error, data } = await readValidatedBody(event, regulatoryApprovalsSchema.safeParse)

    if (!success) {
        console.error('Invalid regulatory approval data:', error);
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid regulatory approval data',
            data: error
        })
    }

    if (!data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Regulatory approval data is required'
        })
    }

    console.log('Creating regulatory approval with data:', data)

    // Save the new regulatory approval to storage
    await useDb().insert(tables.regulatoryApprovals).values(
        {
            ...data
        }
    )

    // Return the created regulatory approval
    const response: ServerResponse<RegulatoryApproval> = {
        status: 'success',
        statusCode: 201,
        statusText: 'Created',
        message: 'Regulatory approval created successfully',
        data: data
    }
    return response

})
