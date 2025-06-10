import type { Trial } from "~/models/trials"
import { TrialsRepository } from "~/repositories/TrialsRepository"

const trialRepository = new TrialsRepository('cached')
export const useTrialsStore = createEntityStore<Trial>(
    'trials',
    trialRepository,
)