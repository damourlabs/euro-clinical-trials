import type { Site } from "~/server/database/schema";
import { SiteRepository } from "~/repositories/SiteRepository"

const sitesRepository = new SiteRepository('cached')
export const useSitesStore = createEntityStore<Site, SiteRepository>(
    'sites',
    sitesRepository,
)