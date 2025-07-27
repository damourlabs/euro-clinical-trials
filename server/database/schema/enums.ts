import { z } from "zod";

function createZodEnumWithMessage<U extends string, T extends [U, ...U[]]>(values: T): z.ZodEnum<T> {
    return z.enum(values, {
        invalid_type_error: "Invalid value provided",
        required_error: "This field is required",
        message: `Must be one of ${values.join(', ')}.`,
        description: `Valid values are: ${values.join(', ')}`
    });
}

//---- Trials 
export const TrialPhaseEnum = createZodEnumWithMessage(["I", "II", "III", "IV"])
export const TrialStatusEnum = createZodEnumWithMessage(["Planning", "Active", "Paused", "Completed", "Terminated"]);

export type TrialPhase = z.infer<typeof TrialPhaseEnum>;
export type TrialStatus = z.infer<typeof TrialStatusEnum>;

//---- Patients
export const PatientStatusEnum = createZodEnumWithMessage(['Screening', 'Enrolled', 'Active', 'Completed', 'Withdrawn', 'Discontinued'])

export const AEOutcomeEnum = createZodEnumWithMessage(['Resolved', 'Ongoing', 'Fatal']);
export const AESeverityEnum = createZodEnumWithMessage(['Mild', 'Moderate', 'Severe']);

export type PatientStatus = z.infer<typeof PatientStatusEnum>;
export type AEOutcome = z.infer<typeof AEOutcomeEnum>;
export type AESeverity = z.infer<typeof AESeverityEnum>;

//---- Study Design
export const BlindingEnum = createZodEnumWithMessage(["Single", "Double", "Triple", "OpenLabel"]);
export const RandomizationStrategyEnum = createZodEnumWithMessage(["Simple", "Stratified", "Block", "Adaptive"]);

export type Blinding = z.infer<typeof BlindingEnum>;
export type RandomizationStrategy = z.infer<typeof RandomizationStrategyEnum>;


//---- Sites
export const FacilityTypeEnum = createZodEnumWithMessage(['Hospital', 'Clinic', 'University', 'ResearchCenter']);

//---- Admin
export const SiteStatusEnum = createZodEnumWithMessage(['Active', 'Inactive', 'Pending', 'Closed']);
export const UserRoleEnum = createZodEnumWithMessage(['Sponsor', 'Investigator', 'Coordinator', 'Monitor', 'Patient', 'Nurse', 'Admin', 'Regulatory', 'DataManager', 'Statistician', 'EthicsCommittee']);
export const DocumentTypeEnum = createZodEnumWithMessage(['Protocol', 'InformedConsent', 'RegulatoryApproval', 'Other']);
export const DataSubmissionStatus = createZodEnumWithMessage(['OnTime', 'Delayed', 'NotSubmitted']);
export const VisitStatus = createZodEnumWithMessage(['OnTime', 'Delayed', 'NotSubmitted']);
export const VisitType = createZodEnumWithMessage(['Screening', 'FollowUp', 'EndOfTrial']);

export type SiteStatus = z.infer<typeof SiteStatusEnum>;
export type UserRole = z.infer<typeof UserRoleEnum>;
export type DocumentType = z.infer<typeof DocumentTypeEnum>;
export type DataSubmissionStatusType = z.infer<typeof DataSubmissionStatus>;
export type VisitStatusType = z.infer<typeof VisitStatus>;

//---- Audit 
export const AuditAction = createZodEnumWithMessage(['Create', 'Update', 'Delete', 'View'])
export const AuditEntityType = createZodEnumWithMessage(['Trial', 'Patient', 'Visit', 'AdverseEvent', 'GDPRConsent'])

export type AuditActionType = z.infer<typeof AuditAction>;
export type AuditEntityTypeType = z.infer<typeof AuditEntityType>;


//---- Regulation
export const ApprovalStatusEnum = createZodEnumWithMessage(['Approved', 'Pending', 'Rejected']);
export const ApprovalTypeEnum = createZodEnumWithMessage(['ClinicalTrial', 'MarketingAuthorization', 'DeviceApproval', 'Other']);
export const AnonymizationMethodEnum = createZodEnumWithMessage(['DataMasking', 'DataAggregation', 'DataPseudonymization', 'DataEncryption']);
export const TrialDataTypeEnum = createZodEnumWithMessage(['PersonalData', 'SensitiveData', 'AnonymizedData', 'AggregatedData']);
export const DataSubjectRequestStatusEnum = createZodEnumWithMessage(['Pending', 'Processed', 'Rejected']);
export const DataSubjectRequestTypeEnum = createZodEnumWithMessage(['Access', 'Rectification', 'Erasure', 'Portability', 'Restriction']);
export const DeletionTriggerEnum = createZodEnumWithMessage(['Manual', 'Automatic', 'PolicyBased']);
export const ConsentStatusEnum = createZodEnumWithMessage(['Consented', 'NotConsented', 'Withdrawn']);
export const ConsentTypeEnum = createZodEnumWithMessage(['Data_processing', 'Data_transfer', 'Marketing']);
// Type of criteria category for inclusion or exclusion in a trial 
export const CriteriaTypeEnum = createZodEnumWithMessage(['Inclusion', 'Exclusion', 'Eligibility']);
export const DataCategoriesEnum = createZodEnumWithMessage(['Health_data', 'Identification_data', 'Contact_data', 'Demographic_data', 'Genetic_data']);
export const LegalBasisEnum = createZodEnumWithMessage(['Consent', 'Contract', 'Legal_obligation', 'Vital_interests', 'Public_task']);
export const PurposeEnum = createZodEnumWithMessage(['Clinical_trial_management', 'Data_analysis', 'Marketing_communication', 'Regulatory_compliance']);
export const ProtocolDeviationSeverityEnum = createZodEnumWithMessage(['Minor', 'Major', 'Critical']);
export const SexEnum = createZodEnumWithMessage(['All', 'Female', 'Male'])
export const WithdrawalMethodEnum = createZodEnumWithMessage(['Patient_portal', 'Email', 'Phone']);
export const WithdrawalReasonEnum = createZodEnumWithMessage(['Personal', 'Data_breach', 'Other']);

export type ApprovalStatus = z.infer<typeof ApprovalStatusEnum>;
export type ApprovalType = z.infer<typeof ApprovalTypeEnum>;
export type AnonymizationMethod = z.infer<typeof AnonymizationMethodEnum>;
export type TrialDataType = z.infer<typeof TrialDataTypeEnum>;
export type DataSubjectRequestStatus = z.infer<typeof DataSubjectRequestStatusEnum>;
export type DataSubjectRequestType = z.infer<typeof DataSubjectRequestTypeEnum>;
export type DeletionTrigger = z.infer<typeof DeletionTriggerEnum>;
export type ConsentStatus = z.infer<typeof ConsentStatusEnum>;
export type ConsentType = z.infer<typeof ConsentTypeEnum>;
export type CriteriaType = z.infer<typeof CriteriaTypeEnum>;
export type DataCategories = z.infer<typeof DataCategoriesEnum>;
export type LegalBasis = z.infer<typeof LegalBasisEnum>;
export type Purpose = z.infer<typeof PurposeEnum>;
export type ProtocolDeviationSeverity = z.infer<typeof ProtocolDeviationSeverityEnum>;
export type SexEnumType = z.infer<typeof SexEnum>;
export type WithdrawalMethod = z.infer<typeof WithdrawalMethodEnum>;
export type WithdrawalReason = z.infer<typeof WithdrawalReasonEnum>;

