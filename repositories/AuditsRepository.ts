// ~/repositories/AuditsRepository.ts
import type { AuditLog } from '~/server/database/schema'
import type { ServerResponse } from '~/models/utils'
import { ResourceRepository } from './ResourceRepository'

export interface AuditFilters {
    search?: string
    action?: string
    entityType?: string
    userId?: string
    trialId?: string
    page?: number
    limit?: number
    sortBy?: 'timestamp' | 'action' | 'entityType'
    sortOrder?: 'asc' | 'desc'
}

export interface AuditsPaginatedResponse {
    audits: AuditLog[]
    total: number
    page: number
    limit: number
}

/**
 * Repository for managing audit operations
 * Extends ResourceRepository to provide CRUD operations for audits
 */
export class AuditsRepository extends ResourceRepository<AuditLog> {
    constructor() {
        super('audits')
    }

    /**
     * Get paginated list of audits with optional filters
     */
    async getAllPaginated(filters: AuditFilters = {}): Promise<ServerResponse<AuditsPaginatedResponse>> {
        const params = new URLSearchParams()

        if (filters.search) params.append('search', filters.search)
        if (filters.action) params.append('action', filters.action)
        if (filters.entityType) params.append('entityType', filters.entityType)
        if (filters.userId) params.append('userId', filters.userId)
        if (filters.trialId) params.append('trialId', filters.trialId)
        if (filters.page) params.append('page', filters.page.toString())
        if (filters.limit) params.append('limit', filters.limit.toString())
        if (filters.sortBy) params.append('sortBy', filters.sortBy)
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

        const queryString = params.toString()
        const url = queryString ? `${this.apiUrl}?${queryString}` : this.apiUrl

        return await $fetch<ServerResponse<AuditsPaginatedResponse>>(url, {
            method: 'GET'
        })
    }

    /**
     * Get audit by ID
     */
    async getById(id: string): Promise<ServerResponse<AuditLog>> {
        return await $fetch<ServerResponse<AuditLog>>(`${this.apiUrl}/${id}`, {
            method: 'GET'
        })
    }

    /**
     * Get audits by trial ID
     */
    async getByTrialId(trialId: string): Promise<ServerResponse<AuditLog[]>> {
        return await $fetch<ServerResponse<AuditLog[]>>(`${this.apiUrl}/trial/${trialId}`, {
            method: 'GET'
        })
    }

    /**
     * Get audits by user ID
     */
    async getByUserId(userId: string): Promise<ServerResponse<AuditLog[]>> {
        return await $fetch<ServerResponse<AuditLog[]>>(`${this.apiUrl}/user/${userId}`, {
            method: 'GET'
        })
    }

    /**
     * Get audits by entity
     */
    async getByEntity(entityType: string, entityId: string): Promise<ServerResponse<AuditLog[]>> {
        return await $fetch<ServerResponse<AuditLog[]>>(`${this.apiUrl}/entity/${entityType}/${entityId}`, {
            method: 'GET'
        })
    }
}
