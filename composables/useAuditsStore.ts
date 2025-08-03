import { AuditsRepository } from "~/repositories/AuditsRepository";
import type { AuditLog } from "~/server/database/schema";

const auditsRepository = new AuditsRepository()
export const useAuditsStore = createEntityStore<AuditLog, AuditsRepository>(
    'audits',
    auditsRepository,
)
