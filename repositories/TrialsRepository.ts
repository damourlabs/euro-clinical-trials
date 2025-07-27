// ~/repositories/TrialsRepository.ts
import type { Trial } from '~/server/database/schema'
import type { TrialStatus, TrialPhase } from '~/server/database/schema/enums'
import type { ServerResponse } from '~/models/utils'
import type { PatientStatistics } from '~/models/patients'
import { ResourceRepository, type REPOSITORY_TYPE } from './ResourceRepository'

export interface TrialFilters {
    search?: string
    status?: TrialStatus
    phase?: TrialPhase
    sponsorId?: string
    indication?: string
    page?: number
    limit?: number
    sortBy?: 'title' | 'startDate' | 'status' | 'phase'
    sortOrder?: 'asc' | 'desc'
}

export interface TrialsPaginatedResponse {
    trials: Trial[]
    total: number
    page: number
    limit: number
}

export class TrialsRepository extends ResourceRepository<Trial> {
    constructor(type: REPOSITORY_TYPE = 'cached') {
        super('trials', type)
    }

    async findByEudraCTNumber(eudraCTNumber: string): Promise<Trial | null> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial>>(`${this.apiUrl}/eudract/${eudraCTNumber}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return null // Trial not found
                default:
                    throw createError({
                        statusCode,
                        statusMessage: statusText || 'An error occurred while fetching the trial',
                        message: message || 'An error occurred while fetching the trial'
                    })
            }
        }
        return data

    }

    async findByProtocolNumber(protocolNumber: string): Promise<Trial | undefined> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial>>(`${this.apiUrl}/protocol/${protocolNumber}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return undefined // Trial not found
                default:
                    throw createError({
                        statusCode,
                        statusMessage: statusText || 'An error occurred while fetching the trial',
                        message: message || 'An error occurred while fetching the trial'
                    })
            }
        }
        return data
    }

    async findBySponsorId(sponsorId: string): Promise<Trial[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial[]>>(`${this.apiUrl}/sponsor/${sponsorId}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No trials found for this sponsor
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching trials for sponsor: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async updateStatus(id: string, trialStatus: TrialStatus): Promise<Trial> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial>>(`${this.apiUrl}/${id}/status`, {
            method: 'PATCH',
            body: { trialStatus }
        })
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while updating trial status: ${message || statusText}`
            })
        }
        return data
    }

    async updateEnrollment(id: string, enrollment: {
        currentEnrollment: number
        targetEnrollment?: number
    }): Promise<Trial> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial>>(`${this.apiUrl}/${id}/enrollment`, {
            method: 'PATCH',
            body: enrollment
        })
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while updating trial enrollment: ${message || statusText}`
            })
        }
        return data
    }

    async getTrialStatistics(): Promise<PatientStatistics> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<PatientStatistics>>(`${this.apiUrl}/statistics`)

        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching trial statistics: ${message || statusText}`
            })
        }
        return data
    }
}
