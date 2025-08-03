// Drizzle ORM schema for Adverse Events tables
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  date,
  check,
  index,
  pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { patients } from '.';
import { AEOutcomeEnum, AESeverityEnum } from './enums';
import { z } from 'zod';
import type { Expect, IsSameType } from '~/types/equality';

const adverseEventFieldsDefaultsValues = {
  severity: AESeverityEnum.Enum.Mild,
  outcome: AEOutcomeEnum.Enum.Ongoing,
  relatedToTrial: false,
};

export const pgAESeverityEnum = pgEnum('adverse_event_severity_enum', AESeverityEnum.Enum);
export const pgAEOutcomeEnum = pgEnum('adverse_event_outcome_enum', AEOutcomeEnum.Enum);

export const adverseEvents = pgTable('adverse_events', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  patientUuid: uuid('patient_uuid').notNull().references(() => patients.uuid, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  eventDate: date('event_date').notNull().default(sql`CURRENT_DATE`),
  severity: pgAESeverityEnum("adverse_event_severity").notNull().default(adverseEventFieldsDefaultsValues.severity),
  outcome: pgAEOutcomeEnum("adverse_event_outcome").notNull().default(adverseEventFieldsDefaultsValues.outcome),
  relatedToTrial: boolean('related_to_trial').notNull().default(adverseEventFieldsDefaultsValues.relatedToTrial),
  reportedAt: timestamp('reported_at', { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_adverse_events_patient').on(table.patientUuid),
  index('idx_adverse_events_date').on(table.eventDate),
  check('adverse_events_description_not_empty', sql`LENGTH(TRIM(${table.description})) > 0`),
  check('adverse_events_resolution_logic', sql`(${table.outcome} = 'Resolved' AND ${table.resolvedAt} IS NOT NULL) OR (${table.outcome} != 'Resolved' AND ${table.resolvedAt} IS NULL)`),
]);

export const AdverseEventSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the adverse event"),
  patientUuid: z.string()
    .uuid()
    .describe("UUID of the patient associated with this adverse event"),
  description: z.string()
    .min(1, "Description cannot be empty")
    .max(500, "Description cannot exceed 500 characters")
    .describe("Detailed description of the adverse event"),
  eventDate: z.string()
    .date()
    .describe("Date when the adverse event occurred, defaults to today"),
  severity: AESeverityEnum
    .default(adverseEventFieldsDefaultsValues.severity)
    .describe("Severity of the adverse event, defaults to Mild"),
  outcome: AEOutcomeEnum
    .default(adverseEventFieldsDefaultsValues.outcome)
    .describe("Outcome of the adverse event, defaults to Ongoing"),
  relatedToTrial: z.boolean()
    .default(adverseEventFieldsDefaultsValues.relatedToTrial)
    .describe("Indicates if the adverse event is related to the trial, defaults to false"),
  reportedAt: z.date()
    .describe("Timestamp when the adverse event was reported, defaults to now"),
  resolvedAt: z.date()
    .nullable()
    .describe("Timestamp when the adverse event was resolved, if applicable"),
  createdAt: z.date()
    .describe("Timestamp when the adverse event record was created, defaults to now"),
  updatedAt: z.date()
    .describe("Timestamp when the adverse event record was last updated, defaults to now"),

})


export type AdverseEvent = z.infer<typeof AdverseEventSchema>;

type _adverseEventSchemaMatchesTable = Expect<IsSameType<AdverseEvent, typeof adverseEvents.$inferSelect>>;
