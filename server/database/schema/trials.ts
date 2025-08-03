// Drizzle ORM schema for Trial Management tables
import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
  check,
  index,
  pgEnum
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';

import { users, auditLogs, complianceStatus, dataAnonymizationLog, dataRetentionPolicies, documents, eligibilityCriteria, gdprConsents, participantEnrollment, patients, protocolDeviations, regulatoryApprovals, sites, studyDesigns, userRoles, protocols } from '.';
import { BlindingEnum, TrialPhaseEnum, TrialStatusEnum } from './enums';
import type { IsSameType, Expect } from '~/types/equality';


// For now, we still pass anyUUID to default fields for visual representation but they SHOUlD never be a possible input in forms
const trialsFieldDefaultValues = {
  description: 'No description provided',
  indication: 'General Indication',
  eudractNumber: 'EUDRACT-0000-0000',
  title: 'Untitled Trial',
  targetEnrollment: 100,
  currentEnrollment: 0,
  phase: TrialPhaseEnum.Enum.I,
  blinding: BlindingEnum.Enum.OpenLabel,
  status: TrialStatusEnum.Enum.Planning,
  actualEndDate: null, // Default to null, will be set when  
}

export const pgTrialPhaseEnum = pgEnum('phase_enum', TrialPhaseEnum.options);
export const pgTrialStatusEnum = pgEnum('status_enum', TrialStatusEnum.options);

export const trials = pgTable('trials', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull().default(trialsFieldDefaultValues.title),
  description: text('description').notNull().default(trialsFieldDefaultValues.description),
  protocolUuid: uuid('protocol_uuid').notNull().references(() => protocols.uuid, { onDelete: 'set null' }),
  indication: varchar('indication', { length: 255 }).notNull().default(trialsFieldDefaultValues.indication),
  phase: pgTrialPhaseEnum("phase").notNull().default(trialsFieldDefaultValues.phase),
  status: pgTrialStatusEnum("status").notNull().default(trialsFieldDefaultValues.status),
  sponsorUuid: uuid('sponsor_uuid').notNull().references(() => users.uuid, { onDelete: 'restrict' }),
  principalInvestigatorUuid: uuid('principal_investigator_uuid').notNull().references(() => users.uuid, { onDelete: 'restrict' }),
  startDate: date('start_date').notNull().default(sql`CURRENT_DATE`),
  estimatedEndDate: date('estimated_end_date').notNull().default(sql`(CURRENT_DATE + INTERVAL '1 year')`),
  actualEndDate: date('actual_end_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_trials_status').on(table.status),
  index('idx_trials_phase').on(table.phase),
  // index('idx_trials_sponsor').on(table.sponsorUuid),
  check('trials_dates_logical', sql`${table.startDate} <= ${table.estimatedEndDate}`),
  check('trials_actual_end_after_start', sql`${table.actualEndDate} IS NULL OR ${table.actualEndDate} >= ${table.startDate}`),
  check('trials_title_not_empty', sql`LENGTH(TRIM(${table.title})) > 0`),
]);

export const trialSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the trial, automatically generated if not provided")
  ,
  title: z.string()
    .min(1, "Trial title is required")
    .max(255, "Trial title must be less than 255 characters")
    .default("Untilted Trial")
    .describe("Title of the clinical trial, typically a short descriptive name")
  ,
  description: z.string()
    .min(1, "Trial description is required")
    .max(600, "Trial description must be less than 600 characters")
    .describe("Brief description of the clinical trial, including its objectives and scope")
    .default(trialsFieldDefaultValues.description)
  ,
  protocolUuid: z.string()
    .uuid()
    .min(1, "Protocol ID is required")
    .describe("Unique identifier for the trial protocol")
  ,
  indication: z.string()
    .min(1, "Indication is required")
    .max(100, "Indication must be less than 100 characters")
    .describe("Medical indication for which the trial is being conducted, e.g., 'Diabetes', 'Cancer', etc.")
    .default(trialsFieldDefaultValues.indication)
  ,
  phase: TrialPhaseEnum
    .describe("Phase of the trial, e.g., Phase I, II, III, or IV")
    .default(TrialPhaseEnum.Enum.I)
  ,
  status: TrialStatusEnum
    .describe("Current status of the trial, e.g., Planning, Active, Completed, etc.")
    .default(TrialStatusEnum.Enum.Planning)
  ,
  sponsorUuid: z.string()
    .uuid()
    .min(1, "Sponsor ID is required")
    .describe("Unique identifier for the sponsor of the trial")
  ,
  principalInvestigatorUuid: z.string()
    .uuid()
    .min(1, "Principal Investigator ID is required")
    .describe("Unique identifier for the principal investigator of the trial")
  ,
  startDate: z.string()
    .date()
    .describe("Start date of the trial, defaults to today if not provided")
    .default(() => new Date().toISOString().split('T')[0]) // Format as YYYY-MM-DD
  ,
  estimatedEndDate: z.string()
    .date()
    .describe("Estimated end date of the trial, defaults to one year from today if not provided")
    .default(() => {
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      return nextYear.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    })
  ,
  actualEndDate: z.string()
    .date()
    .nullable()
    .optional()
    .describe("Actual end date of the trial, if completed")
  ,
  createdAt: z.date()
    .describe("Timestamp of when the trial was created, automatically set to now")
    .optional()
  ,
  updatedAt: z.date()
    .describe("Timestamp of when the trial was last updated, automatically set to now")
    .optional()
  ,
})
// .refine((data) => {
//   // Ensure startDate is before estimatedEndDate
//   const startDate = new Date(data.startDate);
//   const estimatedEndDate = new Date(data.estimatedEndDate);
//   if (startDate > estimatedEndDate) {
//     return false;
//   }
//   // Ensure actualEndDate is either null or after startDate
//   if (data.actualEndDate) {
//     const actualEndDate = new Date(data.actualEndDate);
//     if (actualEndDate < startDate) {
//       return false;
//     }
//   }
//   // Ensure title is not empty  
//   if (!data.title || data.title.trim().length === 0) {
//     return false;
//   }
//   return true;
// });

const trialAdministrativeInfoFieldDefaultValues = {
  anyUUID: () => crypto.randomUUID(),
  createdAt: () => new Date(),
  updatedAt: () => new Date(),
}

export const trialAdministrativeInfo = pgTable('trial_administrative_info', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().unique().references(() => trials.uuid, { onDelete: 'cascade' }),
  sponsorUuid: uuid('sponsor_uuid').notNull().references(() => users.uuid, { onDelete: 'restrict' }),
  principalInvestigatorUuid: uuid('principal_investigator_uuid').notNull().references(() => users.uuid, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const trialAdministrativeInfoSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the trial administrative info, automatically generated if not provided")
    .default(trialAdministrativeInfoFieldDefaultValues.anyUUID)
  ,
  trialUuid: z.string()
    .uuid()
    .describe("Unique identifier for the trial this administrative info belongs to")
    .default(trialAdministrativeInfoFieldDefaultValues.anyUUID)
  ,
  sponsorUuid: z.string()
    .uuid()
    .describe("Unique identifier for the sponsor of the trial")
    .default(trialAdministrativeInfoFieldDefaultValues.anyUUID)
  ,
  principalInvestigatorUuid: z.string()
    .uuid()
    .describe("Unique identifier for the principal investigator of the trial")
    .default(trialAdministrativeInfoFieldDefaultValues.anyUUID)
  ,
  createdAt: z.date()
    .describe("Timestamp of when the trial administrative info was created, automatically set to now")
    .optional()
  ,
  updatedAt: z.date()
    .describe("Timestamp of when the trial administrative info was last updated, automatically set to now")
    .optional()
  ,
});


export type Trial = z.infer<typeof TrialSchema>;
export type TrialAdministrativeInfo = z.infer<typeof trialAdministrativeInfoSchema>;

// Validate to check if the schema respects the table structure
// If this fails, it means the schema and table structure are not in sync
//  i.e:
//  - the schema has fields that are not present in the table or vice versa
//  - the types of the fields do not match
type _trialSchemaMatchesTable = Expect<IsSameType<Trial, typeof trials.$inferSelect>>;
type _trialAdministrativeInfoSchemaMatchesTable = Expect<IsSameType<TrialAdministrativeInfo, typeof trialAdministrativeInfo.$inferSelect>>;

export const trialsRelations = relations(trials, ({ one, many }) => ({
  sponsor: one(users, {
    fields: [trials.sponsorUuid],
    references: [users.uuid],
    relationName: 'sponsor',
  }),
  principalInvestigator: one(users, {
    fields: [trials.principalInvestigatorUuid],
    references: [users.uuid],
    relationName: 'principalInvestigator',
  }),
  administrativeInfo: one(trialAdministrativeInfo),
  studyDesign: one(studyDesigns),
  sites: many(sites),
  patients: many(patients),
  eligibilityCriteria: many(eligibilityCriteria),
  participantEnrollment: one(participantEnrollment),
  regulatoryApprovals: many(regulatoryApprovals),
  complianceStatus: one(complianceStatus),
  protocolDeviations: many(protocolDeviations),
  gdprConsents: many(gdprConsents),
  dataRetentionPolicies: many(dataRetentionPolicies),
  documents: many(documents),
  auditLogs: many(auditLogs),
  dataAnonymizationLog: many(dataAnonymizationLog),
  userRoles: many(userRoles),
}));

export const trialAdministrativeInfoRelations = relations(trialAdministrativeInfo, ({ one }) => ({
  trial: one(trials, {
    fields: [trialAdministrativeInfo.trialUuid],
    references: [trials.uuid],
  }),
  sponsor: one(users, {
    fields: [trialAdministrativeInfo.sponsorUuid],
    references: [users.uuid],
  }),
  principalInvestigator: one(users, {
    fields: [trialAdministrativeInfo.principalInvestigatorUuid],
    references: [users.uuid],
  }),
}));