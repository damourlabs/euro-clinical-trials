// ~/repositories/UserRepository.ts
import type { User, Trial } from '~/server/database/schema'
import type { UserRole } from '~/server/database/schema/enums'
import type { ServerResponse } from '~/models/utils'
import { ResourceRepository, type REPOSITORY_TYPE } from './ResourceRepository'

export interface UserFilters {
    search?: string
    role?: UserRole
    page?: number
    limit?: number
    sortBy?: 'name' | 'email' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export interface UsersPaginatedResponse {
    users: User[]
    total: number
    page: number
    limit: number
}

export interface UserTrialsResponse {
    uuid: string
    role: string
    trialUuid: string
    siteUuid: string
    createdAt: Date
    updatedAt: Date
    trialTitle: string | null
    siteName: string | null
}

export class UsersRepository extends ResourceRepository<User> {
    constructor(type: REPOSITORY_TYPE = 'cached') {
        super('users', type)
    }

    async findByEmail(email: string): Promise<User | null> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<User>>(`${this.apiUrl}/email/${email}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return null // User not found
                default:
                    throw createError({
                        statusCode,
                        statusMessage: statusText || 'An error occurred while fetching the user',
                        message: message || 'An error occurred while fetching the user'
                    })
            }
        }
        return data
    }

    async findByRole(role: UserRole): Promise<User[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<User[]>>(`${this.apiUrl}?role=${role}`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No users found for this role
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching users with role ${role}: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async search(searchTerm: string, roles?: UserRole[]): Promise<User[]> {
        let url = `${this.apiUrl}/search?q=${encodeURIComponent(searchTerm)}`
        if (roles && roles.length > 0) {
            url += `&roles=${roles.join(',')}`
        }

        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<User[]>>(url)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No users found
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while searching users: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async getUserTrials(userId: string): Promise<Trial[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<Trial[]>>(`${this.apiUrl}/${userId}/trials`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No trials found for this user
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching user trials: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async getUserRoles(userId: string): Promise<UserTrialsResponse[]> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<UserTrialsResponse[]>>(`${this.apiUrl}/${userId}/roles`)
        if (status === 'error') {
            switch (statusCode) {
                case 404:
                    return [] // No roles found for this user
                default:
                    throw createError({
                        statusCode,
                        statusMessage: `An error occurred while fetching user roles: ${message || statusText}`
                    })
            }
        }
        return data
    }

    async getCurrentProfile(): Promise<User> {
        const { data, status, statusCode, statusText, message } = await $fetch<ServerResponse<User>>(`${this.apiUrl}/profile`)
        if (status === 'error') {
            throw createError({
                statusCode,
                statusMessage: `An error occurred while fetching current user profile: ${message || statusText}`
            })
        }
        return data
    }
}
