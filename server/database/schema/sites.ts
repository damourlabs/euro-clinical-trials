// Drizzle ORM schema for Site Management tables
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
import { trials, users } from '.';
import { DataSubmissionStatus, FacilityTypeEnum, SiteStatusEnum } from './enums';
import { z } from 'zod';
import type { Expect, IsSameType } from '~/types/equality';

// Default values for site fields
const sitesFieldDefaultValues = {
  anyUUID: () => crypto.randomUUID(),
  name: 'Default Clinical Trial Site',
  address: '123 Default St, Default City, Default Country',
  facilityType: FacilityTypeEnum.Enum.Hospital,
  status: SiteStatusEnum.Enum.Active,
  patientsEnrolled: 0,
  targetEnrollment: 100,
  dataSubmissionStatus: DataSubmissionStatus.Enum.NotSubmitted,
  activationDate: () => new Date().toISOString().split('T')[0], //
  dataCompleteness: '0.00',
  protocolDeviations: 0,
  adverseEventsReported: 0,
};

export const pgFacilityTypeEnum = pgEnum('facility_type_enum', FacilityTypeEnum.options);
export const pgSiteStatusEnum = pgEnum('site_status_enum', SiteStatusEnum.options);
export const pgDataSubmissionStatusEnum = pgEnum('data_submission_status_enum', DataSubmissionStatus.options);

export const sites = pgTable('sites', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().references(() => trials.uuid, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull().default(sitesFieldDefaultValues.name),
  address: text('address').notNull().default(sitesFieldDefaultValues.address),
  contactPersonUuid: uuid('contact_person_uuid').notNull().references(() => users.uuid, { onDelete: 'restrict' }),
  principalInvestigatorUuid: uuid('principal_investigator_uuid').notNull().references(() => users.uuid, { onDelete: 'restrict' }),
  studyCoordinatorUuid: uuid('study_coordinator_uuid').references(() => users.uuid, { onDelete: 'set null' }),
  facilityType: pgFacilityTypeEnum("facility_type").notNull().default(sitesFieldDefaultValues.facilityType),
  status: pgSiteStatusEnum("site_status").notNull().default(sitesFieldDefaultValues.status),
  patientsEnrolled: integer('patients_enrolled').notNull().default(sitesFieldDefaultValues.patientsEnrolled),
  targetEnrollment: integer('target_enrollment').notNull().default(sitesFieldDefaultValues.targetEnrollment),
  dataSubmissionStatus: pgDataSubmissionStatusEnum("data_submission_status").notNull().default(sitesFieldDefaultValues.dataSubmissionStatus),
  activationDate: date('activation_date').notNull().default(sql`CURRENT_DATE`),
  dataCompleteness: decimal('data_completeness', { precision: 5, scale: 2 }).notNull().default(sitesFieldDefaultValues.dataCompleteness),
  lastMonitoringVisit: date('last_monitoring_visit'),
  nextScheduledVisit: date('next_scheduled_visit'),
  protocolDeviations: integer('protocol_deviations').notNull().default(sitesFieldDefaultValues.protocolDeviations),
  adverseEventsReported: integer('adverse_events_reported').notNull().default(sitesFieldDefaultValues.adverseEventsReported),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_sites_trial').on(table.trialUuid),
  index('idx_sites_trial_status').on(table.trialUuid, table.status),
  check('sites_enrollment_positive', sql`${table.patientsEnrolled} >= 0 AND ${table.targetEnrollment} >= 0`),
  check('sites_data_completeness_range', sql`${table.dataCompleteness} >= 0.00 AND ${table.dataCompleteness} <= 100.00`),
  check('sites_counts_positive', sql`${table.protocolDeviations} >= 0 AND ${table.adverseEventsReported} >= 0`),
  check('sites_name_not_empty', sql`LENGTH(TRIM(${table.name})) > 0`),
  check('sites_address_not_empty', sql`LENGTH(TRIM(${table.address})) > 0`),
]);

export const sitesSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the site, automatically generated if not provided")
    .default(sitesFieldDefaultValues.anyUUID),
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial this site is associated with")
    .refine((val) => val !== '', "Trial UUID cannot be empty"),
  name: z.string()
    .describe("Name of the clinical trial site")
    .max(100)
    .default(sitesFieldDefaultValues.name),
  address: z.string()
    .describe("Physical address of the clinical trial site")
    .default(sitesFieldDefaultValues.address),
  contactPersonUuid: z.string()
    .uuid()
    .describe("UUID of the contact person at the site"),
  principalInvestigatorUuid: z.string()
    .uuid()
    .describe("UUID of the principal investigator for the site"),
  studyCoordinatorUuid: z.string()
    .uuid()
    .nullable()
    .describe("UUID of the study coordinator for the site, optional"),
  facilityType: FacilityTypeEnum
    .describe("Type of facility (e.g., Hospital, Clinic, University, Research Center etc.)")
    .default(FacilityTypeEnum.Enum.Hospital),
  status: SiteStatusEnum
    .describe("Current status of the site (e.g., Active, Inactive, Pending, Closed)")
    .default(SiteStatusEnum.Enum.Active),
  patientsEnrolled: z.number()
    .int()
    .nonnegative()
    .describe("Number of patients currently enrolled at the site")
    .default(sitesFieldDefaultValues.patientsEnrolled),
  targetEnrollment: z.number()
    .int()
    .nonnegative()
    .describe("Target number of patients to be enrolled at the site")
    .default(sitesFieldDefaultValues.targetEnrollment),
  dataSubmissionStatus: DataSubmissionStatus
    .describe("Status of data submission for the site (e.g., OnTime, Delayed, NotSubmitted)")
    .default(DataSubmissionStatus.Enum.NotSubmitted),
  activationDate: z.string()
    .date()
    .describe("Date when the site was activated for the trial")
    .default(() => new Date().toISOString().split('T')[0]), // Default to today's date in YYYY-MM-DD format
  dataCompleteness: z.string()
    .describe("Percentage of data completeness for the site, formatted as a string (e.g., '85.50')")
    .default(sitesFieldDefaultValues.dataCompleteness),
  lastMonitoringVisit: z.string()
    .date()
    .nullable()
    .describe("Date of the last monitoring visit at the site, optional"),
  nextScheduledVisit: z.string()
    .date()
    .nullable()
    .describe("Date of the next scheduled monitoring visit at the site, optional"),
  protocolDeviations: z.number()
    .int()
    .nonnegative()
    .describe("Number of protocol deviations reported at the site")
    .default(sitesFieldDefaultValues.protocolDeviations),
  adverseEventsReported: z.number()
    .int()
    .nonnegative()
    .describe("Number of adverse events reported at the site")
    .default(sitesFieldDefaultValues.adverseEventsReported),
  createdAt: z.date()
    .describe("Timestamp of when the site was created, automatically set to now")
    .default(() => new Date()),
  updatedAt: z.date()
    .describe("Timestamp of when the site was last updated, automatically set to now")
    .default(() => new Date()),
})

const siteCertificationsFieldDefaultValues = {
  anyUUID: () => crypto.randomUUID(),
  certificationName: 'Default Certification',
  issuedDate: () => new Date().toISOString().split('T')[0], //
  expiryDate: () => new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // Default to one year
  // from today in YYYY-MM-DD format
};


export const siteCertifications = pgTable('site_certifications', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  siteUuid: uuid('site_uuid').notNull().references(() => sites.uuid, { onDelete: 'cascade' }),
  certificationName: varchar('certification_name', { length: 100 }).notNull(),
  issuedDate: date('issued_date').notNull().default(sql`CURRENT_DATE`), // Default to today's date
  expiryDate: date('expiry_date').notNull().default(sql`CURRENT_DATE + INTERVAL '1 month'`), // Default to today's date + 1 months
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  check('site_certifications_name_not_empty', sql`LENGTH(TRIM(${table.certificationName})) > 0`),
  check('site_certifications_date_order', sql`${table.issuedDate} IS NULL OR ${table.expiryDate} IS NULL OR ${table.issuedDate} <= ${table.expiryDate}`),
]);

export const siteCertificationsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the certification, automatically generated if not provided")
    .default(siteCertificationsFieldDefaultValues.anyUUID),
  siteUuid: z.string()
    .uuid()
    .describe("UUID of the site this certification is associated with")
    .refine((val) => val !== '', "Site UUID cannot be empty"),
  certificationName: z.string()
    .describe("Name of the certification")
    .max(100)
    .default(siteCertificationsFieldDefaultValues.certificationName),
  issuedDate: z.string()
    .date()
    .describe("Date when the certification was issued")
    .default(() => new Date().toISOString().split('T')[0]), // Default to today's date in YYYY-MM-DD format
  expiryDate: z.string()
    .date()
    .describe("Date when the certification expires")
    .default(() => new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]), // Default to one year from today
  createdAt: z.date()
    .describe("Timestamp of when the certification was created, automatically set to now")
    .default(() => new Date()),
  updatedAt: z.date()
    .describe("Timestamp of when the certification was last updated, automatically set to now")
    .default(() => new Date()),
});

export type Site = z.infer<typeof sitesSchema>;
export type SiteCertification = z.infer<typeof siteCertificationsSchema>;

// Validate to check if the schema respects the table structure
// If this fails, it means the schema and table structure are not in sync
//  i.e:
//  - the schema has fields that are not present in the table or vice versa
type _validateSiteSchema = Expect<IsSameType<Site, typeof sites.$inferSelect>>;
type _validateSiteCertificationsSchema = Expect<IsSameType<SiteCertification, typeof siteCertifications.$inferSelect>>;