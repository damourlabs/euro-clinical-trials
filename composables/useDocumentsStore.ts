// ~/composables/useDocumentsStore.ts
import type { Document } from '~/server/database/schema'
import { DocumentsRepository, type DocumentFilters } from '~/repositories/DocumentsRepository'

const documentsRepository = new DocumentsRepository()
export const useDocumentsStore = createEntityStore<Document, DocumentsRepository>(
  'document',
  documentsRepository,
)