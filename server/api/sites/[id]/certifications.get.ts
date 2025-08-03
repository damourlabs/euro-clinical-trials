import type { SiteCertification } from "~/server/database/schema"
import type { ServerResponse } from "~/models/utils"
import { useDb, tables, eq, desc } from "~/server/utils/drizzle"
import { z } from "zod"

export default defineEventHandler(async (event) => {

    const db = useDb()

    const { data, success, error } = await getValidatedRouterParams(event, z.object({
        id: z.string().uuid()
    }).spa)

    if (!success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Site ID is required',
            data: error
        })
    }

    const { id: siteUuid } = data;

    // First check if the site exists
    const sites = await db.select().from(tables.sites).where(eq(tables.sites.uuid, siteUuid)).limit(1)

    if (!sites || sites.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Site not found'
        })
    }

    // Get all certifications for this site
    const certifications = await db
        .select()
        .from(tables.siteCertifications)
        .where(eq(tables.siteCertifications.siteUuid, siteUuid))
        .orderBy(desc(tables.siteCertifications.issuedDate))

    const response: ServerResponse<SiteCertification[]> = {
        status: 'success',
        statusCode: 200,
        statusText: 'OK',
        message: `Found ${certifications.length} certifications for site`,
        data: certifications
    }

    return response
})
