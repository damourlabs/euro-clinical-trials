// ~/repositories/TrialsRepository.ts
import { ResourceRepository, type REPOSITORY_TYPE } from './ResourceRepository'
import type { Site } from '~/server/database/schema'

export class SiteRepository extends ResourceRepository<Site> {
    constructor(type: REPOSITORY_TYPE = 'cached') {
        super('sites', type)
    }
}
