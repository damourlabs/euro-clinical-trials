// Drizzle ORM schema for Regulatory Compliance tables
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  decimal,
  date,
  boolean,
  check,
  pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import type { Expect, IsSameType } from '~/types/equality';
import { sites, trials, patients } from '.';
import { AESeverityEnum, ApprovalStatusEnum, ApprovalTypeEnum } from './enums';

export const regulatoryFieldDefaultValues = {
  approvalType: ApprovalTypeEnum.Enum.ClinicalTrial,
  status: ApprovalStatusEnum.Enum.Approved,
  gdprCompliant: false,
  overallCompliance: '0.00',
  patientCompliance: '0.00',
  siteCompliance: '0.00',
  severity: AESeverityEnum.Enum.Mild
};

export const pgApprovalType = pgEnum('approval_type', ApprovalTypeEnum.options);
export const pgApprovalStatus = pgEnum('approval_status', ApprovalStatusEnum.options);

// ----------------------------
// --- Regulatory Approvals ---
// ----------------------------

export const regulatoryApprovals = pgTable('regulatory_approvals', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().references(() => trials.uuid, { onDelete: 'cascade' }),
  approvalType: pgApprovalType().notNull().default(regulatoryFieldDefaultValues.approvalType),
  status: pgApprovalStatus().notNull().default(regulatoryFieldDefaultValues.status),
  authority: varchar('authority', { length: 255 }).notNull(),
  approvalDate: date('approval_date').default(sql`CURRENT_DATE`),
  expiryDate: date('expiry_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  check('regulatory_approvals_authority_not_empty', sql`LENGTH(TRIM(${table.authority})) > 0`),
  check('regulatory_approvals_date_order', sql`${table.approvalDate} IS NULL OR ${table.expiryDate} IS NULL OR ${table.approvalDate} <= ${table.expiryDate}`),
]);
export const regulatoryApprovalsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the regulatory approval, automatically generated if not provided")
  ,
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial this approval belongs to")
  ,
  approvalType: ApprovalTypeEnum
    .describe("Type of regulatory approval")
    .default(regulatoryFieldDefaultValues.approvalType)
  ,
  status: ApprovalStatusEnum
    .describe("Status of the approval")
    .default(regulatoryFieldDefaultValues.status)
  ,
  authority: z.string()
    .max(255)
    .min(1)
    .describe("Regulatory authority that granted the approval")
  ,
  approvalDate: z.string()
    .nullable()
    .describe("Date when the approval was granted")
  ,
  expiryDate: z.string()
    .nullable()
    .describe("Date when the approval expires")
  ,
  createdAt: z.date()
    .nullable()
    .describe("Timestamp of when the approval record was created")
  ,
});

// -------------------------
// --- Compliance Status ---
// -------------------------

export const complianceStatus = pgTable('compliance_status', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().unique().references(() => trials.uuid, { onDelete: 'cascade' }),
  gdprCompliant: boolean('gdpr_compliant').notNull().default(regulatoryFieldDefaultValues.gdprCompliant),
  overallCompliance: decimal('overall_compliance', { precision: 5, scale: 2 }).notNull().default(regulatoryFieldDefaultValues.overallCompliance),
  patientCompliance: decimal('patient_compliance', { precision: 5, scale: 2 }).notNull().default(regulatoryFieldDefaultValues.patientCompliance),
  siteCompliance: decimal('site_compliance', { precision: 5, scale: 2 }).notNull().default(regulatoryFieldDefaultValues.siteCompliance),
  lastUpdated: date('last_updated').notNull().default(sql`CURRENT_DATE`),
}, (table) => [
  check('compliance_status_percentages_valid', sql`${table.overallCompliance} >= 0.00 AND ${table.overallCompliance} <= 100.00 AND ${table.patientCompliance} >= 0.00 AND ${table.patientCompliance} <= 100.00 AND ${table.siteCompliance} >= 0.00 AND ${table.siteCompliance} <= 100.00`),
]);
export const complianceStatusSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the compliance status, automatically generated if not provided")
  ,
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial this compliance status belongs to")
  ,
  gdprCompliant: z.boolean()
    .describe("Whether the trial is GDPR compliant")
    .default(regulatoryFieldDefaultValues.gdprCompliant)
  ,
  overallCompliance: z.string()
    .describe("Overall compliance percentage")
    .default(regulatoryFieldDefaultValues.overallCompliance)
  ,
  patientCompliance: z.string()
    .describe("Patient compliance percentage")
    .default(regulatoryFieldDefaultValues.patientCompliance)
  ,
  siteCompliance: z.string()
    .describe("Site compliance percentage")
    .default(regulatoryFieldDefaultValues.siteCompliance)
  ,
  lastUpdated: z.string()
    .describe("Date when compliance status was last updated")
  ,
});

// ---------------------------
// --- Protocol Deviations ---
// ---------------------------

export const pgSeverity = pgEnum('severity', AESeverityEnum.options)

export const protocolDeviations = pgTable('protocol_deviations', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().references(() => trials.uuid, { onDelete: 'cascade' }),
  patientUuid: uuid('patient_uuid').references(() => patients.uuid, { onDelete: 'cascade' }),
  siteUuid: uuid('site_uuid').references(() => sites.uuid, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  dateOccurred: date('date_occurred').notNull().default(sql`CURRENT_DATE`),
  severity: pgSeverity().notNull().default(regulatoryFieldDefaultValues.severity),
  impactAssessment: text('impact_assessment'),
  correctiveAction: text('corrective_action'),
  reportedAt: timestamp('reported_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  check('protocol_deviations_description_not_empty', sql`LENGTH(TRIM(${table.description})) > 0`),
]);
export const protocolDeviationsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the protocol deviation, automatically generated if not provided")
  ,
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial this deviation belongs to")
  ,
  patientUuid: z.string()
    .uuid()
    .nullable()
    .describe("UUID of the patient involved in the deviation")
  ,
  siteUuid: z.string()
    .uuid()
    .nullable()
    .describe("UUID of the site where the deviation occurred")
  ,
  description: z.string()
    .min(1)
    .describe("Description of the protocol deviation")
  ,
  dateOccurred: z.string()
    .describe("Date when the deviation occurred")
  ,
  severity: AESeverityEnum
    .describe("Severity of the deviation")
    .default(regulatoryFieldDefaultValues.severity)
  ,
  impactAssessment: z.string()
    .nullable()
    .describe("Assessment of the deviation's impact")
  ,
  correctiveAction: z.string()
    .nullable()
    .describe("Corrective action taken for the deviation")
  ,
  reportedAt: z.date()
    .nullable()
    .describe("Timestamp when the deviation was reported")
  ,
});

export type RegulatoryApproval = z.infer<typeof regulatoryApprovalsSchema>;
export type ComplianceStatus = z.infer<typeof complianceStatusSchema>;
export type ProtocolDeviation = z.infer<typeof protocolDeviationsSchema>;

// TODO: Fix type mismatches between Zod schemas and Drizzle table types
type _regulatoryApprovalSchemaMatchesTable = Expect<IsSameType<RegulatoryApproval, typeof regulatoryApprovals.$inferSelect>>
type _complianceStatusSchemaMatchesTable = Expect<IsSameType<ComplianceStatus, typeof complianceStatus.$inferSelect>>
type _protocolDeviationSchemaMatchesTable = Expect<IsSameType<ProtocolDeviation, typeof protocolDeviations.$inferSelect>>
