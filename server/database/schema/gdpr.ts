// Drizzle ORM schema for GDPR Compliance tables
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  date,
  boolean,
  jsonb,
  check,
  unique,
  index,
  pgEnum
} from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';
import { z } from 'zod';
import type { Expect, IsSameType } from '~/types/equality';
import { users, patients, trials } from '.';

import { pgConsentStatusEnum } from './patients';

import { AnonymizationMethodEnum, ConsentStatusEnum, ConsentTypeEnum, DataCategoriesEnum, DataSubjectRequestStatusEnum, DataSubjectRequestTypeEnum, DeletionTriggerEnum, LegalBasisEnum, PurposeEnum, TrialDataTypeEnum, WithdrawalMethodEnum, WithdrawalReasonEnum } from './enums';

// ---------------------
// --- GDPR Consents ---
// ---------------------

export const gdprFieldDefaultValues = {
  consentGiven: false,
  legalBasis: LegalBasisEnum.Enum.Consent,
  consentType: ConsentTypeEnum.Enum.Data_processing,
  purpose: PurposeEnum.Enum.Clinical_trial_management,
  retentionPeriod: 5,
  dataProcessingDetails: 'Data will be processed for the purpose of clinical trial management and regulatory compliance',
  consentStatus: ConsentStatusEnum.Enum.NotConsented,
};

export const pgLegalBasisEnum = pgEnum('legal_basis', LegalBasisEnum.options);
export const pgConsentTypeEnum = pgEnum('consent_type', ConsentTypeEnum.options);
export const pgPurposeEnum = pgEnum('purpose', PurposeEnum.options);
export const pgWithdrawalMethodEnum = pgEnum('withdrawal_method', WithdrawalMethodEnum.options);
export const pgWithdrawalReasonEnum = pgEnum('withdrawal_reason', WithdrawalReasonEnum.options);

export const gdprConsents = pgTable('gdpr_consents', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().references(() => trials.uuid, { onDelete: 'cascade' }),
  patientUuid: uuid('patient_uuid').notNull().references(() => patients.uuid, { onDelete: 'cascade' }),
  consentGiven: boolean('consent_given').notNull().default(gdprFieldDefaultValues.consentGiven),
  consentDate: date('consent_date').notNull().default(sql`CURRENT_DATE`),
  legalBasis: pgLegalBasisEnum().notNull().default(gdprFieldDefaultValues.legalBasis),
  consentType: pgConsentTypeEnum().notNull().default(gdprFieldDefaultValues.consentType),
  purpose: pgPurposeEnum().notNull().default(gdprFieldDefaultValues.purpose),
  retentionPeriod: integer('retention_period').notNull().default(gdprFieldDefaultValues.retentionPeriod),
  dataProcessingDetails: text('data_processing_details').notNull().default(gdprFieldDefaultValues.dataProcessingDetails),
  userAgent: text('user_agent'),
  consentStatus: pgConsentStatusEnum().notNull().default(gdprFieldDefaultValues.consentStatus),
  withdrawalDate: date('withdrawal_date'),
  withdrawalMethod: pgWithdrawalMethodEnum(),
  withdrawalReason: pgWithdrawalReasonEnum(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_gdpr_consents_patient').on(table.patientUuid),
  index('idx_gdpr_consents_trial').on(table.trialUuid),
  check('gdpr_consents_retention_positive', sql`${table.retentionPeriod} > 0`),
  check('gdpr_consents_withdrawal_logic', sql`(${table.consentStatus} = 'Withdrawn' AND ${table.withdrawalDate} IS NOT NULL) OR (${table.consentStatus} != 'Withdrawn' AND ${table.withdrawalDate} IS NULL)`),
]);

// Zod schemas for validation
export const gdprConsentsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the GDPR consent, automatically generated if not provided")
  ,
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial this consent belongs to")
  ,
  patientUuid: z.string()
    .uuid()
    .describe("UUID of the patient who gave consent")
  ,
  consentGiven: z.boolean()
    .describe("Whether consent was given")
    .default(gdprFieldDefaultValues.consentGiven)
  ,
  consentDate: z.string()
    .describe("Date when consent was given")
  ,
  legalBasis: LegalBasisEnum
    .describe("Legal basis for data processing")
    .default(gdprFieldDefaultValues.legalBasis)
  ,
  consentType: ConsentTypeEnum
    .describe("Type of consent")
    .default(gdprFieldDefaultValues.consentType)
  ,
  purpose: PurposeEnum
    .describe("Purpose of data processing")
    .default(gdprFieldDefaultValues.purpose)
  ,
  retentionPeriod: z.number()
    .int()
    .positive()
    .describe("Data retention period in years")
    .default(gdprFieldDefaultValues.retentionPeriod)
  ,
  dataProcessingDetails: z.string()
    .describe("Details about data processing")
    .default(gdprFieldDefaultValues.dataProcessingDetails)
  ,
  userAgent: z.string()
    .nullable()
    .describe("User agent when consent was given")
  ,
  consentStatus: ConsentStatusEnum
    .describe("Current status of consent")
    .default(gdprFieldDefaultValues.consentStatus)
  ,
  withdrawalDate: z.string()
    .nullable()
    .describe("Date when consent was withdrawn")
  ,
  withdrawalMethod: WithdrawalMethodEnum
    .nullable()
    .describe("Method used to withdraw consent")
  ,
  withdrawalReason: WithdrawalReasonEnum
    .nullable()
    .describe("Reason for withdrawing consent")
  ,
  createdAt: z.date()
    .nullable()
    .describe("Timestamp of when the consent record was created")
  ,
  updatedAt: z.date()
    .nullable()
    .describe("Timestamp of when the consent record was last updated")
  ,
});


// ----------------------------
// --- GDPR Data Categories ---
// ----------------------------

export const pgCategoryEnum = pgEnum('gdpr_data_category', DataCategoriesEnum.options);

export const gdprDataCategories = pgTable('gdpr_data_categories', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  consentUuid: uuid('consent_uuid').notNull().references(() => gdprConsents.uuid, { onDelete: 'cascade' }),
  category: pgCategoryEnum().notNull().default(DataCategoriesEnum.Enum.Health_data),
}, (table) => [
  unique('gdpr_data_categories_unique_per_consent').on(table.consentUuid, table.category),
]);

export const gdprDataCategoriesSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the data category, automatically generated if not provided")
  ,
  consentUuid: z.string()
    .uuid()
    .describe("UUID of the consent this data category belongs to")
  ,
  category: DataCategoriesEnum
    .describe("Category of data being processed")
  ,
});


// -------------------------------
// --- Data Retention Policies ---
// -------------------------------

const dataRententionPoliciesFieldDefaultValues = {
  deletionTrigger: DeletionTriggerEnum.Enum.PolicyBased,
  retentionPeriodYears: 5,
  dataType: TrialDataTypeEnum.Enum.PersonalData,
};

export const pgDeletionTriggerEnum = pgEnum('deletion_trigger', DeletionTriggerEnum.options)
export const pgDataTypeEnum = pgEnum('data_type', TrialDataTypeEnum.options);

export const dataRetentionPolicies = pgTable('data_retention_policies', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().references(() => trials.uuid, { onDelete: 'cascade' }),
  dataType: pgDataTypeEnum().notNull().default(dataRententionPoliciesFieldDefaultValues.dataType),
  retentionPeriodYears: integer('retention_period_years').notNull(),
  deletionTrigger: pgDeletionTriggerEnum('deletion_trigger').notNull().default(dataRententionPoliciesFieldDefaultValues.deletionTrigger),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [

  check('data_retention_policies_retention_positive', sql`${table.retentionPeriodYears} > 0`),
  unique('data_retention_policies_unique_per_trial').on(table.trialUuid, table.dataType),
]);


export const dataRetentionPoliciesSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the retention policy, automatically generated if not provided")
  ,
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial this policy applies to")
  ,
  dataType: TrialDataTypeEnum
    .describe("Type of data the retention policy applies to")
    .default(dataRententionPoliciesFieldDefaultValues.dataType)
  ,
  retentionPeriodYears: z.number()
    .int()
    .positive()
    .describe("Retention period in years")
  ,
  deletionTrigger: DeletionTriggerEnum
    .describe("What triggers the deletion of data")
    .default(dataRententionPoliciesFieldDefaultValues.deletionTrigger)
  ,
  createdAt: z.date()
    .nullable()
    .describe("Timestamp of when the policy was created")
  ,
});

// -------------------------------
// --- Data Subject Requests -----
// -------------------------------

const dataSubjectRequestsFieldDefaultValues = {
  status: DataSubjectRequestStatusEnum.Enum.Pending,
  requestType: DataSubjectRequestTypeEnum.Enum.Access,
}

export const pgDataSubjectRequestTypeEnum = pgEnum('data_subject_request_type', DataSubjectRequestTypeEnum.options);
export const pgDataSubjectRequestStatusEnum = pgEnum('data_subject_request_status', DataSubjectRequestStatusEnum.options);



const DataSubjectRequestResponseDataSchema = z.object({
  requestId: z.string().uuid(),
  patientUuid: z.string().uuid(),
  processedAt: z.string().datetime(),
  processedBy: z.string().uuid(),
  requestType: DataSubjectRequestTypeEnum,
  data: z.record(z.unknown()).optional(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })),
  status: DataSubjectRequestStatusEnum,
  legalBasis: LegalBasisEnum.optional(),
  retentionNotice: z.string().optional(),
});

export type DataSubjectRequestResponseData = z.infer<typeof DataSubjectRequestResponseDataSchema>



export const dataSubjectRequests = pgTable('data_subject_requests', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  patientUuid: uuid('patient_uuid').notNull().references(() => patients.uuid, { onDelete: 'cascade' }),
  requestType: pgDataSubjectRequestTypeEnum().notNull().default(dataSubjectRequestsFieldDefaultValues.requestType),
  status: pgDataSubjectRequestStatusEnum().notNull().default(dataSubjectRequestsFieldDefaultValues.status),
  requestedAt: timestamp('requested_at', { withTimezone: true }).defaultNow(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  processedBy: uuid('processed_by').references(() => users.uuid, { onDelete: 'set null' }),
  responseData: jsonb('response_data').$type<DataSubjectRequestResponseData>().notNull(),
  notes: text('notes'),
}, () => [

]);

export const dataSubjectRequestsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the data subject request, automatically generated if not provided")
  ,
  patientUuid: z.string()
    .uuid()
    .describe("UUID of the patient making the request")
  ,
  requestType: DataSubjectRequestTypeEnum
    .describe("Type of data subject request")
    .default(dataSubjectRequestsFieldDefaultValues.requestType)
  ,
  status: DataSubjectRequestStatusEnum
    .describe("Current status of the request")
    .default(dataSubjectRequestsFieldDefaultValues.status)
  ,
  requestedAt: z.date()
    .nullable()
    .describe("Timestamp when the request was made")
  ,
  processedAt: z.date()
    .nullable()
    .describe("Timestamp when the request was processed")
  ,
  processedBy: z.string()
    .uuid()
    .nullable()
    .describe("UUID of the user who processed the request")
  ,
  responseData: DataSubjectRequestResponseDataSchema
    .describe("Response data for the request, including any errors or processed data")
  ,
  notes: z.string()
    .nullable()
    .describe("Additional notes about the request")
  ,
});


// ------------------------------
// --- Data Anonymization Log ---
// ------------------------------

const gdprAnonymizationFieldDefaultValues = {
  anonymizationMethod: AnonymizationMethodEnum.Enum.DataPseudonymization,
}

export const pgAnonymizationMethodEnum = pgEnum('anonymization_method', AnonymizationMethodEnum.options);

const AnonymizedFieldsSchema = z.object({
  fieldName: z.string(),
});

export type AnonymizedField = z.infer<typeof AnonymizedFieldsSchema>;

export const dataAnonymizationLog = pgTable('data_anonymization_log', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  patientUuid: uuid('patient_uuid').notNull(),
  trialUuid: uuid('trial_uuid').notNull().references(() => trials.uuid, { onDelete: 'cascade' }),
  anonymizationDate: timestamp('anonymization_date', { withTimezone: true }).defaultNow(),
  anonymizationMethod: pgAnonymizationMethodEnum().notNull().default(gdprAnonymizationFieldDefaultValues.anonymizationMethod),
  anonymizedFields: jsonb('anonymized_fields').$type<AnonymizedField>().notNull(),
  performedBy: uuid('performed_by').notNull().references(() => users.uuid, { onDelete: 'restrict' }),
}, () => []);

export const dataAnonymizationLogSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the anonymization log entry, automatically generated if not provided")
  ,
  patientUuid: z.string()
    .uuid()
    .describe("UUID of the patient whose data was anonymized")
  ,
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial the data belongs to")
  ,
  anonymizationDate: z.date()
    .nullable()
    .describe("Date when anonymization was performed")
  ,
  anonymizationMethod: AnonymizationMethodEnum
    .describe("Method used for anonymization")
    .default(gdprAnonymizationFieldDefaultValues.anonymizationMethod)
  ,
  anonymizedFields: AnonymizedFieldsSchema
    .describe("Fields that were anonymized")
  ,
  performedBy: z.string()
    .uuid()
    .describe("UUID of the user who performed the anonymization")
  ,
});

// -----------------------------------
// --- Exported Types & Validation ---
// -----------------------------------

export type GdprConsent = z.infer<typeof gdprConsentsSchema>;
export type GdprDataCategory = z.infer<typeof gdprDataCategoriesSchema>;
export type DataRetentionPolicy = z.infer<typeof dataRetentionPoliciesSchema>;
export type DataSubjectRequest = z.infer<typeof dataSubjectRequestsSchema>;
export type DataAnonymizationLog = z.infer<typeof dataAnonymizationLogSchema>;

// Validate to check if the schemas respect the table structures
// If these fail, it means the schemas and table structures are not in sync
// TODO: Fix type mismatches between Zod schemas and Drizzle table types
type _gdprConsentSchemaMatchesTable = Expect<IsSameType<GdprConsent, typeof gdprConsents.$inferSelect>>
type _gdprDataCategorySchemaMatchesTable = Expect<IsSameType<GdprDataCategory, typeof gdprDataCategories.$inferSelect>>
type _dataRetentionPolicySchemaMatchesTable = Expect<IsSameType<DataRetentionPolicy, typeof dataRetentionPolicies.$inferSelect>>
type _dataSubjectRequestSchemaMatchesTable = Expect<IsSameType<DataSubjectRequest, typeof dataSubjectRequests.$inferSelect>>
type _dataAnonymizationLogSchemaMatchesTable = Expect<IsSameType<DataAnonymizationLog, typeof dataAnonymizationLog.$inferSelect>>
