// ~/repositories/AdverseEventsRepository.ts
import type { AdverseEvent } from '~/server/database/schema'
import type { ServerResponse } from '~/models/utils'
import { ResourceRepository } from './ResourceRepository'

export interface AdverseEventFilters {
    search?: string
    severity?: string
    outcome?: string
    patientId?: string
    relatedToTrial?: boolean
    page?: number
    limit?: number
    sortBy?: 'dateOccurred' | 'reportedAt' | 'severity'
    sortOrder?: 'asc' | 'desc'
}

export interface AdverseEventsPaginatedResponse {
    adverseEvents: AdverseEvent[]
    total: number
    page: number
    limit: number
}

/**
 * Repository for managing adverse event operations
 * Extends ResourceRepository to provide CRUD operations for adverse events
 */
export class AdverseEventsRepository extends ResourceRepository<AdverseEvent> {
    constructor() {
        super('adverse-events')
    }

    /**
     * Get paginated list of adverse events with optional filters
     */
    async getAllPaginated(filters: AdverseEventFilters = {}): Promise<ServerResponse<AdverseEventsPaginatedResponse>> {
        const params = new URLSearchParams()

        if (filters.search) params.append('search', filters.search)
        if (filters.severity) params.append('severity', filters.severity)
        if (filters.outcome) params.append('outcome', filters.outcome)
        if (filters.patientId) params.append('patientId', filters.patientId)
        if (filters.relatedToTrial !== undefined) params.append('relatedToTrial', filters.relatedToTrial.toString())
        if (filters.page) params.append('page', filters.page.toString())
        if (filters.limit) params.append('limit', filters.limit.toString())
        if (filters.sortBy) params.append('sortBy', filters.sortBy)
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

        const queryString = params.toString()
        const url = queryString ? `${this.apiUrl}?${queryString}` : this.apiUrl

        return await $fetch<ServerResponse<AdverseEventsPaginatedResponse>>(url, {
            method: 'GET'
        })
    }

    /**
     * Get adverse event by ID
     */
    async getById(id: string): Promise<ServerResponse<AdverseEvent>> {
        return await $fetch<ServerResponse<AdverseEvent>>(`${this.apiUrl}/${id}`, {
            method: 'GET'
        })
    }

    /**
     * Get adverse events by patient ID
     */
    async getByPatientId(patientId: string): Promise<ServerResponse<AdverseEvent[]>> {
        return await $fetch<ServerResponse<AdverseEvent[]>>(`${this.apiUrl}/patient/${patientId}`, {
            method: 'GET'
        })
    }

    /**
     * Get adverse events by trial ID
     */
    async getByTrialId(trialId: string): Promise<ServerResponse<AdverseEvent[]>> {
        return await $fetch<ServerResponse<AdverseEvent[]>>(`${this.apiUrl}/trial/${trialId}`, {
            method: 'GET'
        })
    }

    /**
     * Get adverse events related to trial
     */
    async getRelatedToTrial(): Promise<ServerResponse<AdverseEvent[]>> {
        return await $fetch<ServerResponse<AdverseEvent[]>>(`${this.apiUrl}/related-to-trial`, {
            method: 'GET'
        })
    }
}
