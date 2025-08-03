import type { AuditLog } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";
import * as tables from "~/server/database/schema";

export default defineEventHandler(async (event) => {
    const db = useDb()
    const auditLogsTable = tables.auditLogs

    const body = await readBody(event)

    try {
        const newAudit = await db.insert(auditLogsTable)
            .values({
                ...body,
                timestamp: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .returning()

        const response: ServerResponse<AuditLog> = {
            message: 'Audit created successfully',
            status: 'success',
            statusText: 'Created',
            statusCode: 201,
            data: newAudit[0]
        }

        return response
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create audit',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
})
