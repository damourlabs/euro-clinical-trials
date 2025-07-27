// Drizzle ORM schema for Audit System tables
import {
  pgTable,
  uuid,
  timestamp,
  jsonb,
  inet,
  text,
  index,
  pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

import type { Expect, IsSameType } from '~/types/equality';
import { trials, users, patients, gdprConsents } from '.';
import { AuditAction, AuditEntityType, LegalBasisEnum } from './enums';

export const auditFieldDefaultValues = {
  action: AuditAction.Enum.View,
  entityType: AuditEntityType.Enum.Trial,
};

export const pgAction = pgEnum('audit_action', AuditAction.options);
export const pgEntityType = pgEnum('audit_entity_type', AuditEntityType.options);

const ValuesShapeSchema = z.object({}).catchall(z.unknown())
const ValueChangesSchema = z.object({
  field: z.string().describe("The field that was changed"),
  oldValue: z.unknown().nullable().describe("The value before the change"),
  newValue: z.unknown().nullable().describe("The value after the change"),
}).describe("Details of a single field change");

type ValuesShape = z.infer<typeof ValuesShapeSchema>;
type ValueChangesShape = z.infer<typeof ValueChangesSchema>;

export const auditLogs = pgTable('audit_logs', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').references(() => trials.uuid, { onDelete: 'cascade' }).notNull(),
  userUuid: uuid('user_uuid').references(() => users.uuid, { onDelete: 'set null' }),
  action: pgAction().notNull().default(auditFieldDefaultValues.action),
  entityType: pgEntityType().notNull().default(auditFieldDefaultValues.entityType),
  entityUuid: uuid('entity_uuid').notNull(),
  oldValues: jsonb('old_values').$type<ValuesShape>(),
  newValues: jsonb('new_values').$type<ValuesShape>(),
  changes: jsonb('changes').$type<ValueChangesShape>().notNull().default(sql`'[]'::jsonb`),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  sessionId: uuid('session_id'),
}, (table) => [
  index('idx_audit_logs_timestamp').on(table.timestamp),
  index('idx_audit_logs_entity').on(table.entityType, table.entityUuid),
]);


// Zod schemas for validation
export const auditLogsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the audit log entry, automatically generated if not provided")
  ,
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial this audit log relates to"),
  userUuid: z.string()
    .uuid()
    .nullable()
    .describe("UUID of the user who performed the action"),
  action: AuditAction
    .describe("Action that was performed")
    .default(auditFieldDefaultValues.action),
  entityType: AuditEntityType
    .describe("Type of entity that was affected")
    .default(auditFieldDefaultValues.entityType),
  entityUuid: z.string()
    .uuid()
    .describe("UUID of the entity that was affected"),
  oldValues: ValuesShapeSchema
    .nullable()
    .describe("Old values before the change"),
  newValues: ValuesShapeSchema
    .nullable()
    .describe("New values after the change"),
  changes: ValueChangesSchema
    .describe("Summary of changes made"),
  timestamp: z.date()
    .describe("Timestamp when the action was performed"),
  ipAddress: z.string()
    .nullable()
    .describe("IP address of the user who performed the action"),
  userAgent: z.string()
    .nullable()
    .describe("User agent of the client that performed the action"),
  sessionId: z.string()
    .uuid()
    .nullable()
    .describe("Session ID of the user who performed the action"),
});

const auditLogDetailsDefaultValues = {
  legalBasis: LegalBasisEnum.Enum.Legal_obligation
};

export const pgLegalBasis = pgEnum('legal_basis', LegalBasisEnum.options);

export const auditLogDetails = pgTable('audit_log_details', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  auditLogUuid: uuid('audit_log_uuid').notNull().unique().references(() => auditLogs.uuid, { onDelete: 'cascade' }),
  consentUuid: uuid('consent_uuid').references(() => gdprConsents.uuid, { onDelete: 'cascade' }),
  patientUuid: uuid('patient_uuid').references(() => patients.uuid, { onDelete: 'cascade' }),
  legalBasis: pgLegalBasis().notNull().default(auditLogDetailsDefaultValues.legalBasis)
});


export const auditLogDetailsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the audit log details, automatically generated if not provided")
  ,
  auditLogUuid: z.string()
    .uuid()
    .describe("UUID of the audit log this detail belongs to"),
  consentUuid: z.string()
    .uuid()
    .nullable()
    .describe("UUID of the GDPR consent related to this audit"),
  patientUuid: z.string()
    .uuid()
    .nullable()
    .describe("UUID of the patient related to this audit"),
  legalBasis: LegalBasisEnum
    .describe("Legal basis for the audit action"),
});

export type AuditLog = z.infer<typeof auditLogsSchema>;
export type AuditLogDetail = z.infer<typeof auditLogDetailsSchema>;

// TODO: Fix type mismatches between Zod schemas and Drizzle table types
type _auditLogSchemaMatchesTable = Expect<IsSameType<AuditLog, typeof auditLogs.$inferSelect>>
type _auditLogDetailSchemaMatchesTable = Expect<IsSameType<AuditLogDetail, typeof auditLogDetails.$inferSelect>>
