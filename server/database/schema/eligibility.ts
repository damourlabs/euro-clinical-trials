// Drizzle ORM schema for Eligibility and Enrollment tables
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  check,
  unique,
  pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import type { Expect, IsSameType } from '~/types/equality';
import { trials } from '.';
import { CriteriaTypeEnum, SexEnum } from './enums';

export const eligibilityFieldDefaultValues = {
  minAge: 0,
  maxAge: 100,
  sex: SexEnum.Enum.All,
  criteriaType: CriteriaTypeEnum.Enum.Inclusion,
  currentEnrollment: 0,
  targetEnrollment: 100,
};

// ----------------------------
// --- Eligibility Criteria ---
// ----------------------------

export const pgSex = pgEnum('sex', SexEnum.options);

export const eligibilityCriteria = pgTable('eligibility_criteria', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().references(() => trials.uuid, { onDelete: 'cascade' }),
  minAge: integer('min_age').notNull().default(eligibilityFieldDefaultValues.minAge),
  maxAge: integer('max_age').notNull().default(eligibilityFieldDefaultValues.maxAge),
  sex: pgSex().notNull().default(eligibilityFieldDefaultValues.sex),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  check('eligibility_criteria_age_range', sql`${table.minAge} <= ${table.maxAge}`),
  check('eligibility_criteria_age_positive', sql`${table.minAge} >= 0 AND ${table.maxAge} >= 0`),
]);
export const eligibilityCriteriaSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the eligibility criteria, automatically generated if not provided")
  ,
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial these criteria belong to")
  ,
  minAge: z.number()
    .int()
    .min(0)
    .describe("Minimum age for participation")
    .default(eligibilityFieldDefaultValues.minAge)
  ,
  maxAge: z.number()
    .int()
    .min(0)
    .describe("Maximum age for participation")
    .default(eligibilityFieldDefaultValues.maxAge)
  ,
  sex: SexEnum
    .describe("Sex requirement for participation")
    .default(eligibilityFieldDefaultValues.sex)
  ,
  createdAt: z.date()
    .nullable()
    .describe("Timestamp of when the criteria were created")
  ,
});

// ------------------
// --- Conditions ---
// ------------------

export const conditions = pgTable('conditions', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  check('conditions_name_not_empty', sql`LENGTH(TRIM(${table.name})) > 0`),
]);
export const conditionsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the condition, automatically generated if not provided")
  ,
  name: z.string()
    .max(255)
    .min(1)
    .describe("Name of the condition")
  ,
  description: z.string()
    .nullable()
    .describe("Description of the condition")
  ,
  createdAt: z.date()
    .nullable()
    .describe("Timestamp of when the condition was created")
  ,
});

// ------------------------------
// --- Eligibility Conditions ---
// ------------------------------

export const eligibilityConditions = pgTable('eligibility_conditions', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  eligibilityCriteriaUuid: uuid('eligibility_criteria_uuid').notNull().references(() => eligibilityCriteria.uuid, { onDelete: 'cascade' }),
  conditionUuid: uuid('condition_uuid').notNull().references(() => conditions.uuid, { onDelete: 'cascade' }),
}, (table) => [
  unique('eligibility_conditions_unique').on(table.eligibilityCriteriaUuid, table.conditionUuid),
]);
export const eligibilityConditionsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the eligibility condition link, automatically generated if not provided")
  ,
  eligibilityCriteriaUuid: z.string()
    .uuid()
    .describe("UUID of the eligibility criteria")
  ,
  conditionUuid: z.string()
    .uuid()
    .describe("UUID of the condition")
  ,
});

// --------------------------------
// --- Criteria for Eligibility ---
// --------------------------------

export const pgCriteriaType = pgEnum('criteria_type', CriteriaTypeEnum.options);

export const criteria = pgTable('criteria', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  eligibilityCriteriaUuid: uuid('eligibility_criteria_uuid').notNull().references(() => eligibilityCriteria.uuid, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  criteriaType: pgCriteriaType().notNull().default(eligibilityFieldDefaultValues.criteriaType),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [

  check('criteria_description_not_empty', sql`LENGTH(TRIM(${table.description})) > 0`),
]);
export const criteriaSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the criteria, automatically generated if not provided")
  ,
  eligibilityCriteriaUuid: z.string()
    .uuid()
    .describe("UUID of the eligibility criteria this criterion belongs to")
  ,
  description: z.string()
    .min(1)
    .describe("Description of the criterion")
  ,
  criteriaType: z.enum(['Inclusion', 'Exclusion', 'Eligibility'])
    .describe("Type of criterion")
    .default(eligibilityFieldDefaultValues.criteriaType)
  ,
  createdAt: z.date()
    .nullable()
    .describe("Timestamp of when the criterion was created")
  ,
});

// ------------------------------
// --- Participant Enrollment ---
// ------------------------------
export const participantEnrollment = pgTable('participant_enrollment', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().unique().references(() => trials.uuid, { onDelete: 'cascade' }),
  currentEnrollment: integer('current_enrollment').notNull().default(eligibilityFieldDefaultValues.currentEnrollment),
  targetEnrollment: integer('target_enrollment').notNull().default(eligibilityFieldDefaultValues.targetEnrollment),
  eligibilityCriteriaUuid: uuid('eligibility_criteria_uuid').notNull().references(() => eligibilityCriteria.uuid, { onDelete: 'restrict' }),
}, (table) => [
  check('participant_enrollment_numbers_positive', sql`${table.currentEnrollment} >= 0 AND ${table.targetEnrollment} >= 0`),
  check('participant_enrollment_realistic', sql`${table.currentEnrollment} <= ${table.targetEnrollment}`),
]);
export const participantEnrollmentSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the participant enrollment, automatically generated if not provided")
  ,
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial this enrollment belongs to")
  ,
  currentEnrollment: z.number()
    .int()
    .min(0)
    .describe("Current number of enrolled participants")
    .default(eligibilityFieldDefaultValues.currentEnrollment)
  ,
  targetEnrollment: z.number()
    .int()
    .min(0)
    .describe("Target number of participants to enroll")
    .default(eligibilityFieldDefaultValues.targetEnrollment)
  ,
  eligibilityCriteriaUuid: z.string()
    .uuid()
    .describe("UUID of the eligibility criteria")
  ,
});

export type EligibilityCriteria = z.infer<typeof eligibilityCriteriaSchema>;
export type Condition = z.infer<typeof conditionsSchema>;
export type EligibilityCondition = z.infer<typeof eligibilityConditionsSchema>;
export type Criteria = z.infer<typeof criteriaSchema>;
export type ParticipantEnrollment = z.infer<typeof participantEnrollmentSchema>;

// TODO: Fix type mismatches between Zod schemas and Drizzle table types
type _eligibilityCriteriaSchemaMatchesTable = Expect<IsSameType<EligibilityCriteria, typeof eligibilityCriteria.$inferSelect>>
type _conditionSchemaMatchesTable = Expect<IsSameType<Condition, typeof conditions.$inferSelect>>
type _eligibilityConditionSchemaMatchesTable = Expect<IsSameType<EligibilityCondition, typeof eligibilityConditions.$inferSelect>>
type _criteriaSchemaMatchesTable = Expect<IsSameType<Criteria, typeof criteria.$inferSelect>>
type _participantEnrollmentSchemaMatchesTable = Expect<IsSameType<ParticipantEnrollment, typeof participantEnrollment.$inferSelect>>