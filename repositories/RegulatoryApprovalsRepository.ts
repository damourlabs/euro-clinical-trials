// ~/repositories/RegulatoryApprovalsRepository.ts
import type { RegulatoryApproval } from '~/server/database/schema'
import type { ServerResponse } from '~/models/utils'
import { ResourceRepository, type REPOSITORY_TYPE } from './ResourceRepository'

export interface RegulatoryApprovalFilters {
    search?: string
    approvalType?: string
    status?: string
    authority?: string
    trialUuid?: string
    page?: number
    limit?: number
    sortBy?: 'authority' | 'approvalDate' | 'status' | 'approvalType'
    sortOrder?: 'asc' | 'desc'
}

export interface RegulatoryApprovalsPaginatedResponse {
    regulatoryApprovals: RegulatoryApproval[]
    total: number
    page: number
    limit: number
}

export class RegulatoryApprovalsRepository extends ResourceRepository<RegulatoryApproval> {
    constructor(type: REPOSITORY_TYPE = 'cached') {
        super('regulatory-approvals', type)
    }

    async findByTrialId(trialId: string): Promise<RegulatoryApproval[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<RegulatoryApproval[]>>(`${this.apiUrl}/trial/${trialId}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No regulatory approvals found for this trial
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching regulatory approvals for trial: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async findByAuthority(authority: string): Promise<RegulatoryApproval[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<RegulatoryApproval[]>>(`${this.apiUrl}/authority/${authority}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No regulatory approvals found for this authority
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching regulatory approvals by authority: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async findByStatus(status: string): Promise<RegulatoryApproval[]> {
        const { data, status: responseStatus, statusCode, statusText, message } = await $fetch<ServerResponse<RegulatoryApproval[]>>(`${this.apiUrl}/status/${status}`)
        if (responseStatus === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No regulatory approvals found with this status
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching regulatory approvals by status: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async findByApprovalType(approvalType: string): Promise<RegulatoryApproval[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<RegulatoryApproval[]>>(`${this.apiUrl}/type/${approvalType}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No regulatory approvals found of this type
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching regulatory approvals by type: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async findExpiringSoon(days: number = 30): Promise<RegulatoryApproval[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<RegulatoryApproval[]>>(`${this.apiUrl}/expiring/${days}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No regulatory approvals expiring soon
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching expiring regulatory approvals: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async getRegulatoryApprovalsByFilter(filters: RegulatoryApprovalFilters): Promise<RegulatoryApprovalsPaginatedResponse> {
        const queryParams = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString())
            }
        })

        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<RegulatoryApprovalsPaginatedResponse>>(
            `${this.apiUrl}/search?${queryParams.toString()}`
        )

        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while searching regulatory approvals: ${message || statusText}`
            })
        }

        return data
    }
}
