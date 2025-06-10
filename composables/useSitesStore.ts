import type { Site } from "~/models/admin"
import { SiteRepository } from "~/repositories/SiteRepository"

const sitesRepository = new SiteRepository('cached')
export const useSitesStore = createEntityStore<Site>(
    'sites',
    sitesRepository,
)