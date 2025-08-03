// Drizzle ORM schema for Patient Management tables
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  date,
  check,
  index,
  pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { trials, sites } from '.';
import { ConsentStatusEnum, PatientStatusEnum } from './enums';
import { z } from 'zod';
import type { Expect, IsSameType } from '~/types/equality';

const patiensFieldDefaultValues = {
  subjectId: 'Unknown',
  status: PatientStatusEnum.Enum.Active,
  consentStatus: ConsentStatusEnum.Enum.NotConsented,
  dataCompleteness: '0.00',
  enrollmentDate: () => new Date().toISOString().split('T')[0], //
  randomizationGroup: 'NotAssigned',
  createdAt: () => new Date(),
  updatedAt: () => new Date(),
};

export const pgPatientStatusEnum = pgEnum('patient_status_enum', PatientStatusEnum.options);
export const pgConsentStatusEnum = pgEnum('consent_status_enum', ConsentStatusEnum.options);


export const patients = pgTable('patients', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().references(() => trials.uuid, { onDelete: 'cascade' }),
  siteUuid: uuid('site_uuid').notNull().references(() => sites.uuid, { onDelete: 'cascade' }),
  subjectId: varchar('subject_id', { length: 50 }).notNull(),
  status: pgPatientStatusEnum("status").notNull().default(patiensFieldDefaultValues.status),
  consentStatus: pgConsentStatusEnum("consent_status").notNull().default(patiensFieldDefaultValues.consentStatus),
  dataCompleteness: decimal('data_completeness', { precision: 5, scale: 2 }).notNull().default(patiensFieldDefaultValues.dataCompleteness),
  enrollmentDate: date('enrollment_date').default(sql`CURRENT_DATE`),
  randomizationGroup: varchar('randomization_group', { length: 50 }).notNull().default(patiensFieldDefaultValues.randomizationGroup),
  withdrawalDate: date('withdrawal_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_patients_trial').on(table.trialUuid),
  index('idx_patients_site').on(table.siteUuid),
  index('idx_patients_status').on(table.status),
  index('idx_patients_trial_status').on(table.trialUuid, table.status),
  check('patients_data_completeness_range', sql`${table.dataCompleteness} >= 0.00 AND ${table.dataCompleteness} <= 100.00`),
  check('patients_enrollment_before_withdrawal', sql`${table.enrollmentDate} IS NULL OR ${table.withdrawalDate} IS NULL OR ${table.enrollmentDate} <= ${table.withdrawalDate}`),
]);


export const patientSchema = z.object({
  uuid: z.string()
    .uuid()
    .min(1, "Patient UUID is required")
    .describe("Unique identifier for the patient, automatically generated if not provided")
  ,
  trialUuid: z.string()
    .uuid()
    .min(1, "Trial UUID is required")
    .describe("UUID of the trial this patient is enrolled in")
  ,
  siteUuid: z.string()
    .uuid()
    .min(1, "Site UUID is required")
    .describe("UUID of the site where the patient is enrolled")
  ,
  subjectId: z.string()
    .max(50, "Subject ID must be less than 50 characters")
    .default(patiensFieldDefaultValues.subjectId)
    .describe("Unique identifier for the patient within the trial")
  ,
  status: PatientStatusEnum
    .default(patiensFieldDefaultValues.status)
    .describe("Current status of the patient in the trial")
  ,
  consentStatus: ConsentStatusEnum
    .default(patiensFieldDefaultValues.consentStatus)
    .describe("Consent status of the patient for data processing and participation in the trial")
  ,
  dataCompleteness: z.string()
    .regex(/^\d{1,3}(\.\d{1,2})?$/, "Data completeness must be a valid decimal between 0.00 and 100.00")
    .default(patiensFieldDefaultValues.dataCompleteness)
    .describe("Percentage of data completeness for the patient")
  ,
  enrollmentDate: z.string()
    .date()
    .nullable()
    .default(patiensFieldDefaultValues.enrollmentDate)
    .describe("Date when the patient was enrolled in the trial, defaults to today if not provided")
  ,
  randomizationGroup: z.string()
    .max(50, "Randomization group must be less than 50 characters")
    .default(patiensFieldDefaultValues.randomizationGroup)
    .describe("Randomization group the patient belongs to, if applicable")
  ,
  withdrawalDate: z.string()
    .date()
    .nullable()
    .describe("Date when the patient withdrew from the trial, if applicable")
  ,
  createdAt: z.date()
    .describe("Timestamp when the patient record was created, defaults to now")
  ,
  updatedAt: z.date()
    .describe("Timestamp when the patient record was last updated, defaults to now")
  ,
})


// --- Visits Schema ---

const visitsFieldDefaultValues = {
  visitType: 'Screening',
  status: 'Scheduled',
};

export const visits = pgTable('visits', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  patientUuid: uuid('patient_uuid').notNull().references(() => patients.uuid, { onDelete: 'cascade' }),
  siteUuid: uuid('site_uuid').notNull().references(() => sites.uuid, { onDelete: 'cascade' }),
  visitDate: date('visit_date').notNull().default(sql`CURRENT_DATE`),
  visitType: varchar('visit_type', { length: 15 }).notNull().default(visitsFieldDefaultValues.visitType),
  status: varchar('status', { length: 15 }).notNull().default(visitsFieldDefaultValues.status),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_visits_patient').on(table.patientUuid),
  index('idx_visits_date').on(table.visitDate),
  index('idx_visits_patient_date').on(table.patientUuid, table.visitDate),
]);


export const VisitSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the visit, automatically generated if not provided")
    .default(() => crypto.randomUUID())
  ,
  patientUuid: z.string()
    .uuid()
    .describe("UUID of the patient associated with this visit")
  ,
  siteUuid: z.string()
    .uuid()
    .describe("UUID of the site where the visit is conducted")
  ,
  visitDate: z.string()
    .date()
    .default(() => new Date().toISOString().split('T')[0])
    .describe("Date of the visit, defaults to today if not provided")
  ,
  visitType: z.string()
    .min(1, "Visit type must be at least 1 character long")
    .max(15, "Visit type must be less than 15 characters")
    .default('Screening')
    .describe("Type of the visit (e.g., Screening, FollowUp, EndOfTrial)")
  ,
  status: z.string()
    .max(15, "Status must be less than 15 characters")
    .default('Scheduled')
    .describe("Current status of the visit (e.g., Scheduled, Completed, Cancelled, NoShow)")
  ,
  notes: z.string()
    .max(500, "Notes must be less than 500 characters")
    .nullable()
    .describe("Additional notes for the visit")
  ,
  createdAt: z.date()
    .describe("Timestamp when the visit record was created")
  ,
  updatedAt: z.date()

    .describe("Timestamp when the visit record was last updated")
});


// --- Vital Signs Schema ---


export const vitalSigns = pgTable('vital_signs', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  patientUuid: uuid('patient_uuid').notNull().references(() => patients.uuid, { onDelete: 'cascade' }),
  visitUuid: uuid('visit_uuid').notNull().references(() => visits.uuid, { onDelete: 'cascade' }),
  heartRate: integer('heart_rate'),
  systolicBp: integer('systolic_bp'),
  diastolicBp: integer('diastolic_bp'),
  temperature: decimal('temperature', { precision: 4, scale: 2 }),
  respiratoryRate: integer('respiratory_rate'),
  oxygenSaturation: decimal('oxygen_saturation', { precision: 5, scale: 2 }),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check('vital_signs_heart_rate_range', sql`${table.heartRate} IS NULL OR (${table.heartRate} >= 0 AND ${table.heartRate} <= 300)`),
  check('vital_signs_systolic_bp_range', sql`${table.systolicBp} IS NULL OR (${table.systolicBp} >= 0 AND ${table.systolicBp} <= 370)`),
  check('vital_signs_diastolic_bp_range', sql`${table.diastolicBp} IS NULL OR (${table.diastolicBp} >= 0 AND ${table.diastolicBp} <= 360)`),
  check('vital_signs_temperature_range', sql`${table.temperature} IS NULL OR (${table.temperature} >= 30.00 AND ${table.temperature} <= 45.00)`),
  check('vital_signs_respiratory_rate_range', sql`${table.respiratoryRate} IS NULL OR (${table.respiratoryRate} >= 0 AND ${table.respiratoryRate} <= 100)`),
  check('vital_signs_oxygen_saturation_range', sql`${table.oxygenSaturation} IS NULL OR (${table.oxygenSaturation} >= 0.00 AND ${table.oxygenSaturation} <= 100.00)`),
  check('vital_signs_bp_relationship', sql`${table.systolicBp} IS NULL OR ${table.diastolicBp} IS NULL OR ${table.systolicBp} >= ${table.diastolicBp}`),
]);

export const VitalSignsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the vital signs record, automatically generated if not provided")
    .default(() => crypto.randomUUID())
  ,
  patientUuid: z.string()
    .uuid()
    .describe("UUID of the patient associated with these vital signs")
  ,
  visitUuid: z.string()
    .uuid()
    .describe("UUID of the visit during which these vital signs were recorded")
  ,
  heartRate: z.number()
    .min(0, "Heart rate must be a non-negative integer")
    .max(300, "Heart rate must be less than or equal to 300")
    .nullable()
    .describe("Heart rate in beats per minute")
  ,
  systolicBp: z.number()
    .min(0, "Systolic blood pressure must be a non-negative integer")
    .max(370, "Systolic blood pressure must be less than or equal to 370")
    .nullable()
    .describe("Systolic blood pressure in mmHg")
  ,
  diastolicBp: z.number()
    .min(0, "Diastolic blood pressure must be a non-negative integer")
    .max(360, "Diastolic blood pressure must be less than or equal to 360")
    .nullable()
    .describe("Diastolic blood pressure in mmHg")
  ,
  // Since we use decimal for temperature, we check for string instead of number
  temperature: z.string()
    .regex(/^\d{1,2}(\.\d{1,2})?$/, "Temperature must be a valid decimal number")
    .nullable()
    .describe("Body temperature in degrees Celsius, formatted as a decimal")
  ,
  respiratoryRate: z.number()
    .min(0, "Respiratory rate must be a non-negative integer")
    .max(100, "Respiratory rate must be less than or equal to 100 breaths per minute")
    .nullable()
    .describe("Respiratory rate in breaths per minute")
  ,
  // Same as temperature
  oxygenSaturation: z.string()
    .regex(/^\d{1,3}(\.\d{1,2})?$/, "Oxygen saturation must be a valid decimal number")
    .nullable()
    .describe("Oxygen saturation percentage, formatted as a decimal")
  ,
  recordedAt: z.date()
    .describe("Timestamp when the vital signs were recorded, defaults to now")
  ,
  createdAt: z.date()
    .describe("Timestamp when the vital signs record was created")
  ,
  updatedAt: z.date()
    .describe("Timestamp when the vital signs record was last updated")
  ,
});

// --- Patient Statistics ---
export const PatientStatisticsSchema = z.object({
  totalPatients: z.number().int().min(0).describe("Total number of patients enrolled in the trial"),
  activePatients: z.number().int().min(0).describe("Number of patients currently active in the trial"),
  completedPatients: z.number().int().min(0).describe("Number of patients who have completed the trial"),
  withdrawnPatients: z.number().int().min(0).describe("Number of patients who have withdrawn from the trial"),
  patientsByStatus: z.record(PatientStatusEnum, z.number().int().min(0)).describe("Count of patients grouped by their current status in the trial"),
});

export type Patient = z.infer<typeof patientSchema>;
export type Visit = z.infer<typeof VisitSchema>;
export type VitalSigns = z.infer<typeof VitalSignsSchema>;
export type PatientStatistics = z.infer<typeof PatientStatisticsSchema>;

// Validate to check if the schema respects the table structure
// If this fails, it means the schema and table structure are not in sync
//  i.e:
//  - the schema has fields that are not present in the table or vice versa
//  - the types of the fields do not match
type _patienSchemaMatchesTable = Expect<IsSameType<Patient, typeof patients.$inferSelect>>;
type _visitSchemaMatchesTable = Expect<IsSameType<Visit, typeof visits.$inferSelect>>;
type _vitalSignsSchemaMatchesTable = Expect<IsSameType<VitalSigns, typeof vitalSigns.$inferSelect>>;