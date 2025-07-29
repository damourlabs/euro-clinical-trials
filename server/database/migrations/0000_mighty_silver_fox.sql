CREATE TYPE "public"."adverse_event_outcome" AS ENUM('Resolved', 'Ongoing', 'Fatal');--> statement-breakpoint
CREATE TYPE "public"."adverse_event_severity" AS ENUM('Mild', 'Moderate', 'Severe');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('Create', 'Update', 'Delete', 'View');--> statement-breakpoint
CREATE TYPE "public"."audit_entity_type" AS ENUM('Trial', 'Patient', 'Visit', 'AdverseEvent', 'GDPRConsent');--> statement-breakpoint
CREATE TYPE "public"."legal_basis" AS ENUM('Consent', 'Contract', 'Legal_obligation', 'Vital_interests', 'Public_task');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('Protocol', 'InformedConsent', 'RegulatoryApproval', 'Other');--> statement-breakpoint
CREATE TYPE "public"."criteria_type" AS ENUM('Inclusion', 'Exclusion', 'Eligibility');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('All', 'Female', 'Male');--> statement-breakpoint
CREATE TYPE "public"."anonymization_method" AS ENUM('DataMasking', 'DataAggregation', 'DataPseudonymization', 'DataEncryption');--> statement-breakpoint
CREATE TYPE "public"."gdpr_data_category" AS ENUM('Health_data', 'Identification_data', 'Contact_data', 'Demographic_data', 'Genetic_data');--> statement-breakpoint
CREATE TYPE "public"."consent_type" AS ENUM('Data_processing', 'Data_transfer', 'Marketing');--> statement-breakpoint
CREATE TYPE "public"."data_subject_request_status" AS ENUM('Pending', 'Processed', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."data_subject_request_type" AS ENUM('Access', 'Rectification', 'Erasure', 'Portability', 'Restriction');--> statement-breakpoint
CREATE TYPE "public"."data_type" AS ENUM('PersonalData', 'SensitiveData', 'AnonymizedData', 'AggregatedData');--> statement-breakpoint
CREATE TYPE "public"."deletion_trigger" AS ENUM('Manual', 'Automatic', 'PolicyBased');--> statement-breakpoint
CREATE TYPE "public"."purpose" AS ENUM('Clinical_trial_management', 'Data_analysis', 'Marketing_communication', 'Regulatory_compliance');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_method" AS ENUM('Patient_portal', 'Email', 'Phone');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_reason" AS ENUM('Personal', 'Data_breach', 'Other');--> statement-breakpoint
CREATE TYPE "public"."phase_enum" AS ENUM('I', 'II', 'III', 'IV');--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('Planning', 'Active', 'Paused', 'Completed', 'Terminated');--> statement-breakpoint
CREATE TYPE "public"."data_submission_status_enum" AS ENUM('OnTime', 'Delayed', 'NotSubmitted');--> statement-breakpoint
CREATE TYPE "public"."facility_type_enum" AS ENUM('Hospital', 'Clinic', 'University', 'ResearchCenter');--> statement-breakpoint
CREATE TYPE "public"."site_status_enum" AS ENUM('Active', 'Inactive', 'Pending', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."consent_status_enum" AS ENUM('Consented', 'NotConsented', 'Withdrawn');--> statement-breakpoint
CREATE TYPE "public"."patient_status_enum" AS ENUM('Screening', 'Enrolled', 'Active', 'Completed', 'Withdrawn', 'Discontinued');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('Sponsor', 'Investigator', 'Coordinator', 'Monitor', 'Patient', 'Nurse', 'Admin', 'Regulatory', 'DataManager', 'Statistician', 'EthicsCommittee');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('Approved', 'Pending', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."approval_type" AS ENUM('ClinicalTrial', 'MarketingAuthorization', 'DeviceApproval', 'Other');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('Mild', 'Moderate', 'Severe');--> statement-breakpoint
CREATE TYPE "public"."blinding" AS ENUM('Single', 'Double', 'Triple', 'OpenLabel');--> statement-breakpoint
CREATE TYPE "public"."randomization_strategy" AS ENUM('Simple', 'Stratified', 'Block', 'Adaptive');--> statement-breakpoint
CREATE TABLE "adverse_events" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_uuid" uuid NOT NULL,
	"description" text NOT NULL,
	"event_date" date DEFAULT CURRENT_DATE NOT NULL,
	"severity" "adverse_event_severity" DEFAULT 'Mild' NOT NULL,
	"outcome" "adverse_event_outcome" DEFAULT 'Ongoing' NOT NULL,
	"related_to_trial" boolean DEFAULT false NOT NULL,
	"reported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "adverse_events_description_not_empty" CHECK (LENGTH(TRIM("adverse_events"."description")) > 0),
	CONSTRAINT "adverse_events_resolution_logic" CHECK (("adverse_events"."outcome" = 'Resolved' AND "adverse_events"."resolved_at" IS NOT NULL) OR ("adverse_events"."outcome" != 'Resolved' AND "adverse_events"."resolved_at" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "audit_log_details" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"audit_log_uuid" uuid NOT NULL,
	"consent_uuid" uuid,
	"patient_uuid" uuid,
	"legalBasis" "legal_basis" DEFAULT 'Legal_obligation' NOT NULL,
	CONSTRAINT "audit_log_details_audit_log_uuid_unique" UNIQUE("audit_log_uuid")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"user_uuid" uuid,
	"action" "audit_action" DEFAULT 'View' NOT NULL,
	"entityType" "audit_entity_type" DEFAULT 'Trial' NOT NULL,
	"entity_uuid" uuid NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"changes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" "inet",
	"user_agent" text,
	"session_id" uuid
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"documentType" "document_type" DEFAULT 'Other' NOT NULL,
	"description" text,
	"upload_date" date DEFAULT CURRENT_DATE NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"trial_uuid" uuid,
	"site_uuid" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "documents_title_not_empty" CHECK (LENGTH(TRIM("documents"."title")) > 0),
	CONSTRAINT "documents_url_not_empty" CHECK (LENGTH(TRIM("documents"."url")) > 0)
);
--> statement-breakpoint
CREATE TABLE "regulatory_documents" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"regulatory_approval_uuid" uuid NOT NULL,
	"document_uuid" uuid NOT NULL,
	CONSTRAINT "regulatory_documents_unique" UNIQUE("regulatory_approval_uuid","document_uuid")
);
--> statement-breakpoint
CREATE TABLE "conditions" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "conditions_name_unique" UNIQUE("name"),
	CONSTRAINT "conditions_name_not_empty" CHECK (LENGTH(TRIM("conditions"."name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "criteria" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eligibility_criteria_uuid" uuid NOT NULL,
	"description" text NOT NULL,
	"criteriaType" "criteria_type" DEFAULT 'Inclusion' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "criteria_description_not_empty" CHECK (LENGTH(TRIM("criteria"."description")) > 0)
);
--> statement-breakpoint
CREATE TABLE "eligibility_conditions" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eligibility_criteria_uuid" uuid NOT NULL,
	"condition_uuid" uuid NOT NULL,
	CONSTRAINT "eligibility_conditions_unique" UNIQUE("eligibility_criteria_uuid","condition_uuid")
);
--> statement-breakpoint
CREATE TABLE "eligibility_criteria" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"min_age" integer DEFAULT 0 NOT NULL,
	"max_age" integer DEFAULT 100 NOT NULL,
	"sex" "sex" DEFAULT 'All' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "eligibility_criteria_age_range" CHECK ("eligibility_criteria"."min_age" <= "eligibility_criteria"."max_age"),
	CONSTRAINT "eligibility_criteria_age_positive" CHECK ("eligibility_criteria"."min_age" >= 0 AND "eligibility_criteria"."max_age" >= 0)
);
--> statement-breakpoint
CREATE TABLE "participant_enrollment" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"current_enrollment" integer DEFAULT 0 NOT NULL,
	"target_enrollment" integer DEFAULT 100 NOT NULL,
	"eligibility_criteria_uuid" uuid NOT NULL,
	CONSTRAINT "participant_enrollment_trial_uuid_unique" UNIQUE("trial_uuid"),
	CONSTRAINT "participant_enrollment_numbers_positive" CHECK ("participant_enrollment"."current_enrollment" >= 0 AND "participant_enrollment"."target_enrollment" >= 0),
	CONSTRAINT "participant_enrollment_realistic" CHECK ("participant_enrollment"."current_enrollment" <= "participant_enrollment"."target_enrollment")
);
--> statement-breakpoint
CREATE TABLE "data_anonymization_log" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_uuid" uuid NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"anonymization_date" timestamp with time zone DEFAULT now(),
	"anonymizationMethod" "anonymization_method" DEFAULT 'DataPseudonymization' NOT NULL,
	"anonymized_fields" jsonb NOT NULL,
	"performed_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_retention_policies" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"dataType" "data_type" DEFAULT 'PersonalData' NOT NULL,
	"retention_period_years" integer NOT NULL,
	"deletion_trigger" "deletion_trigger" DEFAULT 'PolicyBased' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "data_retention_policies_unique_per_trial" UNIQUE("trial_uuid","dataType"),
	CONSTRAINT "data_retention_policies_retention_positive" CHECK ("data_retention_policies"."retention_period_years" > 0)
);
--> statement-breakpoint
CREATE TABLE "data_subject_requests" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_uuid" uuid NOT NULL,
	"requestType" "data_subject_request_type" DEFAULT 'Access' NOT NULL,
	"status" "data_subject_request_status" DEFAULT 'Pending' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now(),
	"processed_at" timestamp with time zone,
	"processed_by" uuid,
	"response_data" jsonb NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "gdpr_consents" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"patient_uuid" uuid NOT NULL,
	"consent_given" boolean DEFAULT false NOT NULL,
	"consent_date" date DEFAULT CURRENT_DATE NOT NULL,
	"legalBasis" "legal_basis" DEFAULT 'Consent' NOT NULL,
	"consentType" "consent_type" DEFAULT 'Data_processing' NOT NULL,
	"purpose" "purpose" DEFAULT 'Clinical_trial_management' NOT NULL,
	"retention_period" integer DEFAULT 5 NOT NULL,
	"data_processing_details" text DEFAULT 'Data will be processed for the purpose of clinical trial management and regulatory compliance' NOT NULL,
	"user_agent" text,
	"consentStatus" "consent_status_enum" DEFAULT 'NotConsented' NOT NULL,
	"withdrawal_date" date,
	"withdrawalMethod" "withdrawal_method",
	"withdrawalReason" "withdrawal_reason",
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "gdpr_consents_retention_positive" CHECK ("gdpr_consents"."retention_period" > 0),
	CONSTRAINT "gdpr_consents_withdrawal_logic" CHECK (("gdpr_consents"."consentStatus" = 'Withdrawn' AND "gdpr_consents"."withdrawal_date" IS NOT NULL) OR ("gdpr_consents"."consentStatus" != 'Withdrawn' AND "gdpr_consents"."withdrawal_date" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "gdpr_data_categories" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"consent_uuid" uuid NOT NULL,
	"category" "gdpr_data_category" DEFAULT 'Health_data' NOT NULL,
	CONSTRAINT "gdpr_data_categories_unique_per_consent" UNIQUE("consent_uuid","category")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone_number" varchar(20),
	"institution" varchar(100) DEFAULT 'Unknown Institution' NOT NULL,
	"role" varchar(50) DEFAULT 'Patient' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"email_verification_token" varchar(255),
	"email_verification_expires" timestamp with time zone,
	"magic_link_token" varchar(255),
	"magic_link_expires" timestamp with time zone,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"two_factor_secret" varchar(255),
	"two_factor_token" varchar(10),
	"two_factor_expires" timestamp with time zone,
	"login_attempts" integer DEFAULT 0 NOT NULL,
	"account_locked_until" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"github_id" varchar(100),
	"gdpr_consent_given" boolean DEFAULT false NOT NULL,
	"gdpr_consent_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_email_format" CHECK ("users"."email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
	CONSTRAINT "users_name_not_empty" CHECK (LENGTH(TRIM("users"."name")) > 0),
	CONSTRAINT "users_login_attempts_non_negative" CHECK ("users"."login_attempts" >= 0)
);
--> statement-breakpoint
CREATE TABLE "trial_administrative_info" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"sponsor_uuid" uuid NOT NULL,
	"principal_investigator_uuid" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trial_administrative_info_trial_uuid_unique" UNIQUE("trial_uuid")
);
--> statement-breakpoint
CREATE TABLE "trials" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) DEFAULT 'Untitled Trial' NOT NULL,
	"description" text DEFAULT 'No description provided' NOT NULL,
	"protocol_uuid" uuid NOT NULL,
	"indication" varchar(255) DEFAULT 'General Indication' NOT NULL,
	"phase" "phase_enum" DEFAULT 'I' NOT NULL,
	"status" "status_enum" DEFAULT 'Planning' NOT NULL,
	"sponsor_uuid" uuid NOT NULL,
	"principal_investigator_uuid" uuid NOT NULL,
	"start_date" date DEFAULT CURRENT_DATE NOT NULL,
	"estimated_end_date" date DEFAULT (CURRENT_DATE + INTERVAL '1 year') NOT NULL,
	"actual_end_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trials_dates_logical" CHECK ("trials"."start_date" <= "trials"."estimated_end_date"),
	CONSTRAINT "trials_actual_end_after_start" CHECK ("trials"."actual_end_date" IS NULL OR "trials"."actual_end_date" >= "trials"."start_date"),
	CONSTRAINT "trials_title_not_empty" CHECK (LENGTH(TRIM("trials"."title")) > 0)
);
--> statement-breakpoint
CREATE TABLE "site_certifications" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_uuid" uuid NOT NULL,
	"certification_name" varchar(100) NOT NULL,
	"issued_date" date DEFAULT CURRENT_DATE NOT NULL,
	"expiry_date" date DEFAULT CURRENT_DATE + INTERVAL '1 month' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_certifications_name_not_empty" CHECK (LENGTH(TRIM("site_certifications"."certification_name")) > 0),
	CONSTRAINT "site_certifications_date_order" CHECK ("site_certifications"."issued_date" IS NULL OR "site_certifications"."expiry_date" IS NULL OR "site_certifications"."issued_date" <= "site_certifications"."expiry_date")
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"name" varchar(100) DEFAULT 'Default Clinical Trial Site' NOT NULL,
	"address" text DEFAULT '123 Default St, Default City, Default Country' NOT NULL,
	"contact_person_uuid" uuid NOT NULL,
	"principal_investigator_uuid" uuid NOT NULL,
	"study_coordinator_uuid" uuid,
	"facilityType" "facility_type_enum" DEFAULT 'Hospital' NOT NULL,
	"status" "site_status_enum" DEFAULT 'Active' NOT NULL,
	"patients_enrolled" integer DEFAULT 0 NOT NULL,
	"target_enrollment" integer DEFAULT 100 NOT NULL,
	"dataSubmissionStatus" "data_submission_status_enum" DEFAULT 'NotSubmitted' NOT NULL,
	"activation_date" date DEFAULT CURRENT_DATE NOT NULL,
	"data_completeness" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"last_monitoring_visit" date,
	"next_scheduled_visit" date,
	"protocol_deviations" integer DEFAULT 0 NOT NULL,
	"adverse_events_reported" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sites_enrollment_positive" CHECK ("sites"."patients_enrolled" >= 0 AND "sites"."target_enrollment" >= 0),
	CONSTRAINT "sites_data_completeness_range" CHECK ("sites"."data_completeness" >= 0.00 AND "sites"."data_completeness" <= 100.00),
	CONSTRAINT "sites_counts_positive" CHECK ("sites"."protocol_deviations" >= 0 AND "sites"."adverse_events_reported" >= 0),
	CONSTRAINT "sites_name_not_empty" CHECK (LENGTH(TRIM("sites"."name")) > 0),
	CONSTRAINT "sites_address_not_empty" CHECK (LENGTH(TRIM("sites"."address")) > 0)
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"site_uuid" uuid NOT NULL,
	"subject_id" varchar(50) NOT NULL,
	"status" "patient_status_enum" DEFAULT 'Active' NOT NULL,
	"consentStatus" "consent_status_enum" DEFAULT 'NotConsented' NOT NULL,
	"data_completeness" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"enrollment_date" date DEFAULT CURRENT_DATE,
	"randomization_group" varchar(50) DEFAULT 'NotAssigned' NOT NULL,
	"withdrawal_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "patients_data_completeness_range" CHECK ("patients"."data_completeness" >= 0.00 AND "patients"."data_completeness" <= 100.00),
	CONSTRAINT "patients_enrollment_before_withdrawal" CHECK ("patients"."enrollment_date" IS NULL OR "patients"."withdrawal_date" IS NULL OR "patients"."enrollment_date" <= "patients"."withdrawal_date")
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_uuid" uuid NOT NULL,
	"site_uuid" uuid NOT NULL,
	"visit_date" date DEFAULT CURRENT_DATE NOT NULL,
	"visit_type" varchar(15) DEFAULT 'Screening' NOT NULL,
	"status" varchar(15) DEFAULT 'Scheduled' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vital_signs" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_uuid" uuid NOT NULL,
	"visit_uuid" uuid NOT NULL,
	"heart_rate" integer,
	"systolic_bp" integer,
	"diastolic_bp" integer,
	"temperature" numeric(4, 2),
	"respiratory_rate" integer,
	"oxygen_saturation" numeric(5, 2),
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vital_signs_heart_rate_range" CHECK ("vital_signs"."heart_rate" IS NULL OR ("vital_signs"."heart_rate" >= 0 AND "vital_signs"."heart_rate" <= 300)),
	CONSTRAINT "vital_signs_systolic_bp_range" CHECK ("vital_signs"."systolic_bp" IS NULL OR ("vital_signs"."systolic_bp" >= 0 AND "vital_signs"."systolic_bp" <= 370)),
	CONSTRAINT "vital_signs_diastolic_bp_range" CHECK ("vital_signs"."diastolic_bp" IS NULL OR ("vital_signs"."diastolic_bp" >= 0 AND "vital_signs"."diastolic_bp" <= 360)),
	CONSTRAINT "vital_signs_temperature_range" CHECK ("vital_signs"."temperature" IS NULL OR ("vital_signs"."temperature" >= 30.00 AND "vital_signs"."temperature" <= 45.00)),
	CONSTRAINT "vital_signs_respiratory_rate_range" CHECK ("vital_signs"."respiratory_rate" IS NULL OR ("vital_signs"."respiratory_rate" >= 0 AND "vital_signs"."respiratory_rate" <= 100)),
	CONSTRAINT "vital_signs_oxygen_saturation_range" CHECK ("vital_signs"."oxygen_saturation" IS NULL OR ("vital_signs"."oxygen_saturation" >= 0.00 AND "vital_signs"."oxygen_saturation" <= 100.00)),
	CONSTRAINT "vital_signs_bp_relationship" CHECK ("vital_signs"."systolic_bp" IS NULL OR "vital_signs"."diastolic_bp" IS NULL OR "vital_signs"."systolic_bp" >= "vital_signs"."diastolic_bp")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"role" "user_role" DEFAULT 'Patient' NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"site_uuid" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_unique_per_context" UNIQUE("user_uuid","role","trial_uuid","site_uuid")
);
--> statement-breakpoint
CREATE TABLE "compliance_status" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"gdpr_compliant" boolean DEFAULT false NOT NULL,
	"overall_compliance" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"patient_compliance" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"site_compliance" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"last_updated" date DEFAULT CURRENT_DATE NOT NULL,
	CONSTRAINT "compliance_status_trial_uuid_unique" UNIQUE("trial_uuid"),
	CONSTRAINT "compliance_status_percentages_valid" CHECK ("compliance_status"."overall_compliance" >= 0.00 AND "compliance_status"."overall_compliance" <= 100.00 AND "compliance_status"."patient_compliance" >= 0.00 AND "compliance_status"."patient_compliance" <= 100.00 AND "compliance_status"."site_compliance" >= 0.00 AND "compliance_status"."site_compliance" <= 100.00)
);
--> statement-breakpoint
CREATE TABLE "protocol_deviations" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"patient_uuid" uuid,
	"site_uuid" uuid,
	"description" text NOT NULL,
	"date_occurred" date DEFAULT CURRENT_DATE NOT NULL,
	"severity" "severity" DEFAULT 'Mild' NOT NULL,
	"impact_assessment" text,
	"corrective_action" text,
	"reported_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "protocol_deviations_description_not_empty" CHECK (LENGTH(TRIM("protocol_deviations"."description")) > 0)
);
--> statement-breakpoint
CREATE TABLE "regulatory_approvals" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"approvalType" "approval_type" DEFAULT 'ClinicalTrial' NOT NULL,
	"status" "approval_status" DEFAULT 'Approved' NOT NULL,
	"authority" varchar(255) NOT NULL,
	"approval_date" date DEFAULT CURRENT_DATE,
	"expiry_date" date,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "regulatory_approvals_authority_not_empty" CHECK (LENGTH(TRIM("regulatory_approvals"."authority")) > 0),
	CONSTRAINT "regulatory_approvals_date_order" CHECK ("regulatory_approvals"."approval_date" IS NULL OR "regulatory_approvals"."expiry_date" IS NULL OR "regulatory_approvals"."approval_date" <= "regulatory_approvals"."expiry_date")
);
--> statement-breakpoint
CREATE TABLE "endpoint_data" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"endpoint_uuid" uuid NOT NULL,
	"patient_uuid" uuid NOT NULL,
	"visit_uuid" uuid,
	"value" numeric(15, 4) NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "endpoint_data_unique_per_visit" UNIQUE("endpoint_uuid","patient_uuid","visit_uuid")
);
--> statement-breakpoint
CREATE TABLE "endpoints" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text DEFAULT 'No description provided' NOT NULL,
	"measurement_method" varchar(255) NOT NULL,
	"target_value" numeric(10, 2),
	"unit" varchar(50) DEFAULT 'Not specified' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "endpoints_description_not_empty" CHECK (LENGTH(TRIM("endpoints"."description")) > 0),
	CONSTRAINT "endpoints_unit_not_empty" CHECK (LENGTH(TRIM("endpoints"."unit")) > 0)
);
--> statement-breakpoint
CREATE TABLE "protocols" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "protocols_unique_per_trial" UNIQUE("uuid","name")
);
--> statement-breakpoint
CREATE TABLE "randomization_strategies" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "randomization_strategy" DEFAULT 'Simple' NOT NULL,
	"allocation_ratio" varchar(10),
	"block_size" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "randomization_strategies_block_size_positive" CHECK ("randomization_strategies"."block_size" IS NULL OR "randomization_strategies"."block_size" > 0)
);
--> statement-breakpoint
CREATE TABLE "secondary_endpoints" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"study_design_uuid" uuid NOT NULL,
	"endpoint_uuid" uuid NOT NULL,
	CONSTRAINT "secondary_endpoints_unique_per_design" UNIQUE("study_design_uuid","endpoint_uuid")
);
--> statement-breakpoint
CREATE TABLE "stratification_factors" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"randomization_strategy_uuid" uuid NOT NULL,
	"factor_name" varchar(100) NOT NULL,
	CONSTRAINT "stratification_factors_unique_per_strategy" UNIQUE("randomization_strategy_uuid","factor_name"),
	CONSTRAINT "stratification_factors_name_not_empty" CHECK (LENGTH(TRIM("stratification_factors"."factor_name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "study_designs" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trial_uuid" uuid NOT NULL,
	"blinding" "blinding" DEFAULT 'OpenLabel' NOT NULL,
	"randomization_strategy_uuid" uuid NOT NULL,
	"primary_endpoint_uuid" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "study_designs_trial_uuid_unique" UNIQUE("trial_uuid")
);
--> statement-breakpoint
ALTER TABLE "adverse_events" ADD CONSTRAINT "adverse_events_patient_uuid_patients_uuid_fk" FOREIGN KEY ("patient_uuid") REFERENCES "public"."patients"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log_details" ADD CONSTRAINT "audit_log_details_audit_log_uuid_audit_logs_uuid_fk" FOREIGN KEY ("audit_log_uuid") REFERENCES "public"."audit_logs"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log_details" ADD CONSTRAINT "audit_log_details_consent_uuid_gdpr_consents_uuid_fk" FOREIGN KEY ("consent_uuid") REFERENCES "public"."gdpr_consents"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log_details" ADD CONSTRAINT "audit_log_details_patient_uuid_patients_uuid_fk" FOREIGN KEY ("patient_uuid") REFERENCES "public"."patients"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_users_uuid_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_site_uuid_sites_uuid_fk" FOREIGN KEY ("site_uuid") REFERENCES "public"."sites"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulatory_documents" ADD CONSTRAINT "regulatory_documents_regulatory_approval_uuid_regulatory_approvals_uuid_fk" FOREIGN KEY ("regulatory_approval_uuid") REFERENCES "public"."regulatory_approvals"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulatory_documents" ADD CONSTRAINT "regulatory_documents_document_uuid_documents_uuid_fk" FOREIGN KEY ("document_uuid") REFERENCES "public"."documents"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "criteria" ADD CONSTRAINT "criteria_eligibility_criteria_uuid_eligibility_criteria_uuid_fk" FOREIGN KEY ("eligibility_criteria_uuid") REFERENCES "public"."eligibility_criteria"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eligibility_conditions" ADD CONSTRAINT "eligibility_conditions_eligibility_criteria_uuid_eligibility_criteria_uuid_fk" FOREIGN KEY ("eligibility_criteria_uuid") REFERENCES "public"."eligibility_criteria"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eligibility_conditions" ADD CONSTRAINT "eligibility_conditions_condition_uuid_conditions_uuid_fk" FOREIGN KEY ("condition_uuid") REFERENCES "public"."conditions"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eligibility_criteria" ADD CONSTRAINT "eligibility_criteria_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant_enrollment" ADD CONSTRAINT "participant_enrollment_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant_enrollment" ADD CONSTRAINT "participant_enrollment_eligibility_criteria_uuid_eligibility_criteria_uuid_fk" FOREIGN KEY ("eligibility_criteria_uuid") REFERENCES "public"."eligibility_criteria"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_anonymization_log" ADD CONSTRAINT "data_anonymization_log_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_anonymization_log" ADD CONSTRAINT "data_anonymization_log_performed_by_users_uuid_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_retention_policies" ADD CONSTRAINT "data_retention_policies_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_subject_requests" ADD CONSTRAINT "data_subject_requests_patient_uuid_patients_uuid_fk" FOREIGN KEY ("patient_uuid") REFERENCES "public"."patients"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_subject_requests" ADD CONSTRAINT "data_subject_requests_processed_by_users_uuid_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("uuid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gdpr_consents" ADD CONSTRAINT "gdpr_consents_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gdpr_consents" ADD CONSTRAINT "gdpr_consents_patient_uuid_patients_uuid_fk" FOREIGN KEY ("patient_uuid") REFERENCES "public"."patients"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gdpr_data_categories" ADD CONSTRAINT "gdpr_data_categories_consent_uuid_gdpr_consents_uuid_fk" FOREIGN KEY ("consent_uuid") REFERENCES "public"."gdpr_consents"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trial_administrative_info" ADD CONSTRAINT "trial_administrative_info_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trial_administrative_info" ADD CONSTRAINT "trial_administrative_info_sponsor_uuid_users_uuid_fk" FOREIGN KEY ("sponsor_uuid") REFERENCES "public"."users"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trial_administrative_info" ADD CONSTRAINT "trial_administrative_info_principal_investigator_uuid_users_uuid_fk" FOREIGN KEY ("principal_investigator_uuid") REFERENCES "public"."users"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trials" ADD CONSTRAINT "trials_protocol_uuid_protocols_uuid_fk" FOREIGN KEY ("protocol_uuid") REFERENCES "public"."protocols"("uuid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trials" ADD CONSTRAINT "trials_sponsor_uuid_users_uuid_fk" FOREIGN KEY ("sponsor_uuid") REFERENCES "public"."users"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trials" ADD CONSTRAINT "trials_principal_investigator_uuid_users_uuid_fk" FOREIGN KEY ("principal_investigator_uuid") REFERENCES "public"."users"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_certifications" ADD CONSTRAINT "site_certifications_site_uuid_sites_uuid_fk" FOREIGN KEY ("site_uuid") REFERENCES "public"."sites"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_contact_person_uuid_users_uuid_fk" FOREIGN KEY ("contact_person_uuid") REFERENCES "public"."users"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_principal_investigator_uuid_users_uuid_fk" FOREIGN KEY ("principal_investigator_uuid") REFERENCES "public"."users"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_study_coordinator_uuid_users_uuid_fk" FOREIGN KEY ("study_coordinator_uuid") REFERENCES "public"."users"("uuid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_site_uuid_sites_uuid_fk" FOREIGN KEY ("site_uuid") REFERENCES "public"."sites"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_patient_uuid_patients_uuid_fk" FOREIGN KEY ("patient_uuid") REFERENCES "public"."patients"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_site_uuid_sites_uuid_fk" FOREIGN KEY ("site_uuid") REFERENCES "public"."sites"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_patient_uuid_patients_uuid_fk" FOREIGN KEY ("patient_uuid") REFERENCES "public"."patients"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_visit_uuid_visits_uuid_fk" FOREIGN KEY ("visit_uuid") REFERENCES "public"."visits"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_site_uuid_sites_uuid_fk" FOREIGN KEY ("site_uuid") REFERENCES "public"."sites"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_status" ADD CONSTRAINT "compliance_status_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_deviations" ADD CONSTRAINT "protocol_deviations_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_deviations" ADD CONSTRAINT "protocol_deviations_patient_uuid_patients_uuid_fk" FOREIGN KEY ("patient_uuid") REFERENCES "public"."patients"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_deviations" ADD CONSTRAINT "protocol_deviations_site_uuid_sites_uuid_fk" FOREIGN KEY ("site_uuid") REFERENCES "public"."sites"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulatory_approvals" ADD CONSTRAINT "regulatory_approvals_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endpoint_data" ADD CONSTRAINT "endpoint_data_endpoint_uuid_endpoints_uuid_fk" FOREIGN KEY ("endpoint_uuid") REFERENCES "public"."endpoints"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endpoint_data" ADD CONSTRAINT "endpoint_data_patient_uuid_patients_uuid_fk" FOREIGN KEY ("patient_uuid") REFERENCES "public"."patients"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endpoint_data" ADD CONSTRAINT "endpoint_data_visit_uuid_visits_uuid_fk" FOREIGN KEY ("visit_uuid") REFERENCES "public"."visits"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secondary_endpoints" ADD CONSTRAINT "secondary_endpoints_study_design_uuid_study_designs_uuid_fk" FOREIGN KEY ("study_design_uuid") REFERENCES "public"."study_designs"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secondary_endpoints" ADD CONSTRAINT "secondary_endpoints_endpoint_uuid_endpoints_uuid_fk" FOREIGN KEY ("endpoint_uuid") REFERENCES "public"."endpoints"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stratification_factors" ADD CONSTRAINT "stratification_factors_randomization_strategy_uuid_randomization_strategies_uuid_fk" FOREIGN KEY ("randomization_strategy_uuid") REFERENCES "public"."randomization_strategies"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_designs" ADD CONSTRAINT "study_designs_trial_uuid_trials_uuid_fk" FOREIGN KEY ("trial_uuid") REFERENCES "public"."trials"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_designs" ADD CONSTRAINT "study_designs_randomization_strategy_uuid_randomization_strategies_uuid_fk" FOREIGN KEY ("randomization_strategy_uuid") REFERENCES "public"."randomization_strategies"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_designs" ADD CONSTRAINT "study_designs_primary_endpoint_uuid_endpoints_uuid_fk" FOREIGN KEY ("primary_endpoint_uuid") REFERENCES "public"."endpoints"("uuid") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_adverse_events_patient" ON "adverse_events" USING btree ("patient_uuid");--> statement-breakpoint
CREATE INDEX "idx_adverse_events_date" ON "adverse_events" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_timestamp" ON "audit_logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs" USING btree ("entityType","entity_uuid");--> statement-breakpoint
CREATE INDEX "idx_gdpr_consents_patient" ON "gdpr_consents" USING btree ("patient_uuid");--> statement-breakpoint
CREATE INDEX "idx_gdpr_consents_trial" ON "gdpr_consents" USING btree ("trial_uuid");--> statement-breakpoint
CREATE INDEX "idx_trials_status" ON "trials" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_trials_phase" ON "trials" USING btree ("phase");--> statement-breakpoint
CREATE INDEX "idx_sites_trial" ON "sites" USING btree ("trial_uuid");--> statement-breakpoint
CREATE INDEX "idx_sites_trial_status" ON "sites" USING btree ("trial_uuid","status");--> statement-breakpoint
CREATE INDEX "idx_patients_trial" ON "patients" USING btree ("trial_uuid");--> statement-breakpoint
CREATE INDEX "idx_patients_site" ON "patients" USING btree ("site_uuid");--> statement-breakpoint
CREATE INDEX "idx_patients_status" ON "patients" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_patients_trial_status" ON "patients" USING btree ("trial_uuid","status");--> statement-breakpoint
CREATE INDEX "idx_visits_patient" ON "visits" USING btree ("patient_uuid");--> statement-breakpoint
CREATE INDEX "idx_visits_date" ON "visits" USING btree ("visit_date");--> statement-breakpoint
CREATE INDEX "idx_visits_patient_date" ON "visits" USING btree ("patient_uuid","visit_date");