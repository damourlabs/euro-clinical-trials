// ~/repositories/DocumentsRepository.ts
import type { Document } from '~/server/database/schema'
import type { ServerResponse } from '~/models/utils'
import { ResourceRepository, type REPOSITORY_TYPE } from './ResourceRepository'

export interface DocumentFilters {
    search?: string
    documentType?: string
    trialUuid?: string
    siteUuid?: string
    uploadedBy?: string
    page?: number
    limit?: number
    sortBy?: 'title' | 'uploadDate' | 'documentType'
    sortOrder?: 'asc' | 'desc'
}

export interface DocumentsPaginatedResponse {
    documents: Document[]
    total: number
    page: number
    limit: number
}

export class DocumentsRepository extends ResourceRepository<Document> {
    constructor(type: REPOSITORY_TYPE = 'cached') {
        super('documents', type)
    }

    async findByTrialId(trialId: string): Promise<Document[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Document[]>>(`${this.apiUrl}/trial/${trialId}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No documents found for this trial
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching documents for trial: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async findBySiteId(siteId: string): Promise<Document[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Document[]>>(`${this.apiUrl}/site/${siteId}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No documents found for this site
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching documents for site: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async findByType(documentType: string): Promise<Document[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Document[]>>(`${this.apiUrl}/type/${documentType}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No documents found of this type
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching documents by type: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async findByUploader(uploaderId: string): Promise<Document[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Document[]>>(`${this.apiUrl}/uploader/${uploaderId}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No documents found for this uploader
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching documents by uploader: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async getDocumentsByFilter(filters: DocumentFilters): Promise<DocumentsPaginatedResponse> {
        const queryParams = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString())
            }
        })

        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<DocumentsPaginatedResponse>>(
            `${this.apiUrl}/search?${queryParams.toString()}`
        )

        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while searching documents: ${message || statusText}`
            })
        }

        return data
    }
}
