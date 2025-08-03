import type { AuditLog } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils";
import { useDb } from "~/server/utils/drizzle";
import * as tables from "~/server/database/schema";

export default defineEventHandler(async () => {
    const db = useDb()
    const auditLogsTable = tables.auditLogs

    const audits = await db.select().from(auditLogsTable).limit(100)

    if (audits.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No valid audits found'
        })
    }

    const response: ServerResponse<AuditLog[]> = {
        message: 'Audit logs fetched successfully',
        status: 'success',
        statusText: 'OK',
        statusCode: 200,
        data: audits
    }

    return response
})
