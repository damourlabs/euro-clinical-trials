// ~/repositories/TrialsRepository.ts
import type { User, UserRole } from '~/server/database/schema'
import { ResourceRepository, type REPOSITORY_TYPE } from './ResourceRepository'

export interface UserFilters {
    search?: string
    role?: UserRole
    page?: number
    limit?: number
    sortBy?: 'name'
    sortOrder?: 'asc' | 'desc'
}

export interface UsersPaginatedResponse {
    users: User[],
    total: number
    page: number
    limit: number
}

export class UsersRepository extends ResourceRepository<User> {
    constructor(type: REPOSITORY_TYPE = 'cached') {
        super('user', type)
    }
}
