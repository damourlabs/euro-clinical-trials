// ~/composables/useRegulatoryApprovalsStore.ts
import type { RegulatoryApproval } from '~/server/database/schema'
import { RegulatoryApprovalsRepository } from '~/repositories/RegulatoryApprovalsRepository'

const regulatoryApprovalsRepository = new RegulatoryApprovalsRepository()
export const useRegulatoryApprovalsStore = createEntityStore<RegulatoryApproval, RegulatoryApprovalsRepository>(
  'regulatoryApproval',
  regulatoryApprovalsRepository,
)
