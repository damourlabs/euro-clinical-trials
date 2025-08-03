import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";
import * as tables from "~/server/database/schema";

export default defineEventHandler(async (event) => {
    const db = useDb()
    const auditLogsTable = tables.auditLogs

    const auditId = getRouterParam(event, 'id')

    if (!auditId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Audit ID is required'
        })
    }

    try {
        const deletedAudit = await db.delete(auditLogsTable)
            .where(eq(auditLogsTable.uuid, auditId))
            .returning()

        if (deletedAudit.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Audit not found'
            })
        }

        const response: ServerResponse<void> = {
            message: 'Audit deleted successfully',
            status: 'success',
            statusText: 'OK',
            statusCode: 200,
            data: undefined
        }

        return response
    } catch (error) {
        if (error.statusCode) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete audit',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
})
