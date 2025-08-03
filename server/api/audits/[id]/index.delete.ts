import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";
import * as tables from "~/server/database/schema";
import { isNuxtError } from "nuxt/app";

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
        if (!isNuxtError(error)) {
            throw createError({
                status: 500,
                statusMessage: 'Something went wrong',
                message: "Unknown error occured"
            })
        }

        throw error
    }
})
