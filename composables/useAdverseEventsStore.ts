import { AdverseEventsRepository } from "~/repositories/AdverseEventsRepository";
import type { AdverseEvent } from "~/server/database/schema";

const adverseEventsRepository = new AdverseEventsRepository()
export const useAdverseEventsStore = createEntityStore<AdverseEvent, AdverseEventsRepository>(
    'adverse-events',
    adverseEventsRepository,
)
