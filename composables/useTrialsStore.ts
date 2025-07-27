import type { Trial } from "~/server/database/schema"
import { TrialsRepository } from "~/repositories/TrialsRepository"

const trialRepository = new TrialsRepository('cached')
export const useTrialsStore = createEntityStore<Trial>(
    'trials',
    trialRepository,
)