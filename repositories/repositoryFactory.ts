// ~/repositories/RepositoryFactory.ts
import type { Entity } from './BaseRepository'
import { ResourceRepository, type REPOSITORY_TYPE } from './ResourceRepository'

export function createResourceRepository<T extends Entity>(
    resource: string,
    type: REPOSITORY_TYPE = 'cached'
): ResourceRepository<T> {
    return new ResourceRepository<T>(resource, type)
}