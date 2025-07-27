import type { Protocol } from '~/server/database/schema'

import { ResourceRepository, type REPOSITORY_TYPE } from './ResourceRepository'

export class ProtocolRepository extends ResourceRepository<Protocol> {
    constructor(type: REPOSITORY_TYPE = 'cached') {
        super('protocols', type)
    }

    async findByProtocolId(protocolId: string): Promise<Protocol | undefined> {
        return this.findById(protocolId)
    }
}