// ~/repositories/SiteRepository.ts
import type { ServerResponse } from '~/models/utils';
import { ResourceRepository, type REPOSITORY_TYPE } from './ResourceRepository'
import type { User, Site, Trial, SiteCertification, Document } from '~/server/database/schema';

export class SiteRepository extends ResourceRepository<Site> {
    constructor(type: REPOSITORY_TYPE = 'cached') {
        super('sites', type)
    }

    async getSiteTrial(siteUuid: string): Promise<Trial> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial>>(`${this.apiUrl}/${siteUuid}/trial`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial for site ${siteUuid}: ${message || statusText}`
            })
        }
        return data
    }

    async getSiteContactPerson(siteUuid: string): Promise<User> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<User>>(`${this.apiUrl}/${siteUuid}/contact-person`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching contact person for site ${siteUuid}: ${message || statusText}`
            })
        }
        return data
    }

    async getSitePrincipalInvestigator(siteUuid: string): Promise<User> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<User>>(`${this.apiUrl}/${siteUuid}/principal-investigator`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching principal investigator for site ${siteUuid}: ${message || statusText}`
            })
        }
        return data
    }

    async getSiteStudyCoordinator(siteUuid: string): Promise<User | null> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<User | null>>(`${this.apiUrl}/${siteUuid}/study-coordinator`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return null // Study coordinator is optional, so return null if not found
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching study coordinator for site ${siteUuid}: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async getSiteCertifications(siteUuid: string): Promise<SiteCertification[]> {
        console.log("Fetching site certifactions....")
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<SiteCertification[]>>(`${this.apiUrl}/${siteUuid}/certifications`)
        console.log("Got: ", data)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching certifications for site ${siteUuid}: ${message || statusText}`
            })
        }
        return data
    }

    async getSiteDocuments(siteUuid: string): Promise<Document[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Document[]>>(`${this.apiUrl}/${siteUuid}/documents`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching documents for site ${siteUuid}: ${message || statusText}`
            })
        }
        return data
    }

}
