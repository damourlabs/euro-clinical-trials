// Drizzle ORM schema for Documents tables
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  check,
  unique,
  pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import type { Expect, IsSameType } from '~/types/equality';
import { trials, sites, users, regulatoryApprovals } from '.';
import { DocumentTypeEnum } from './enums';

export const documentsFieldDefaultValues = {
  documentType: DocumentTypeEnum.Enum.Other
};

export const pgDocumentTypeEnum = pgEnum('document_type_enum', DocumentTypeEnum.Enum);

export const documents = pgTable('documents', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  url: text('url').notNull(),
  documentType: pgDocumentTypeEnum("document_type").notNull().default(documentsFieldDefaultValues.documentType),
  description: text('description'),
  uploadDate: date('upload_date').notNull().default(sql`CURRENT_DATE`),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.uuid, { onDelete: 'restrict' }),
  trialUuid: uuid('trial_uuid').references(() => trials.uuid, { onDelete: 'cascade' }),
  siteUuid: uuid('site_uuid').references(() => sites.uuid, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  check('documents_title_not_empty', sql`LENGTH(TRIM(${table.title})) > 0`),
  check('documents_url_not_empty', sql`LENGTH(TRIM(${table.url})) > 0`),
]);

// Zod schemas for validation
export const documentsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the document, automatically generated if not provided")
  ,
  title: z.string()
    .min(1)
    .max(255)
    .describe("Title of the document")
  ,
  url: z.string()
    .url()
    .describe("URL where the document is stored")
  ,
  documentType: DocumentTypeEnum
    .describe("Type of document")
    .default(documentsFieldDefaultValues.documentType)
  ,
  description: z.string()
    .nullable()
    .describe("Description of the document")
  ,
  uploadDate: z.string()
    .describe("Date when the document was uploaded")
  ,
  uploadedBy: z.string()
    .uuid()
    .describe("UUID of the user who uploaded the document")
  ,
  trialUuid: z.string()
    .uuid()
    .nullable()
    .describe("UUID of the trial this document belongs to")
  ,
  siteUuid: z.string()
    .uuid()
    .nullable()
    .describe("UUID of the site this document belongs to")
  ,
  createdAt: z.date()
    .nullable()
    .describe("Timestamp of when the document record was created")
  ,
});

export const regulatoryDocuments = pgTable('regulatory_documents', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  regulatoryApprovalUuid: uuid('regulatory_approval_uuid').notNull().references(() => regulatoryApprovals.uuid, { onDelete: 'cascade' }),
  documentUuid: uuid('document_uuid').notNull().references(() => documents.uuid, { onDelete: 'cascade' }),
}, (table) => [
  unique('regulatory_documents_unique').on(table.regulatoryApprovalUuid, table.documentUuid),
]);

export const regulatoryDocumentsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the regulatory document link, automatically generated if not provided")
  ,
  regulatoryApprovalUuid: z.string()
    .uuid()
    .describe("UUID of the regulatory approval this document belongs to")
  ,
  documentUuid: z.string()
    .uuid()
    .describe("UUID of the document")
  ,
});

export type Document = z.infer<typeof documentsSchema>;
export type RegulatoryDocument = z.infer<typeof regulatoryDocumentsSchema>;


type _documentSchemaMatchesTable = Expect<IsSameType<Document, typeof documents.$inferSelect>>
type _regulatoryDocumentSchemaMatchesTable = Expect<IsSameType<RegulatoryDocument, typeof regulatoryDocuments.$inferSelect>>
