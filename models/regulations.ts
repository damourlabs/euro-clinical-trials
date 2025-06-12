import { z } from "zod";
import { ApprovalTypeEnum, ApprovalStatusEnum, ConsentStatusEnum, ConsentTypeEnum, DataCategoriesEnum, PurposeEnum, WithdrawalMethodEnum, ProtocolDeviationSeverityEnum } from "./enums";

export const GDPRConsentSchema = z.object({
    id: z.string().uuid().describe("Unique identifier for the GDPR consent record"),
    trialId: z.string().uuid().describe("Unique identifier for the trial associated with this consent"),
    patientId: z.string().uuid().describe("Unique identifier for the patient providing consent"),
    consentGiven: z.boolean().default(false).describe("Whether the patient has given consent for data processing"),
    consentDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Date when the patient gave consent, defaults to today if not provided"),
    legalBasis: z.string().default("Consent").describe("Legal basis for processing the patient's data, e.g., 'Consent', 'Contractual necessity', 'Legal obligation'"),
    withdrawalDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).optional().describe("Date when the patient withdrew consent, if applicable"),
    withdrawalMethod: WithdrawalMethodEnum.default(WithdrawalMethodEnum.Enum.Patient_portal).describe("Method by which the patient withdrew consent, e.g., 'Patient portal', 'Email', 'Phone'"),
    withdrawalReason: z.string().optional().describe("Reason for withdrawal if applicable"),
    consentType: ConsentTypeEnum.default(ConsentTypeEnum.Enum.Data_processing).describe("Type of consent given, e.g., 'Data processing', 'Data transfer', 'Marketing'"),
    purpose: PurposeEnum.default(PurposeEnum.Enum.Clinical_trial_management).describe("Purpose for which the consent is given, e.g., 'Clinical trial management', 'Data analysis', 'Marketing communication', 'Regulatory compliance'"),
    userAgent: z.string().default("Unknown").describe("User agent string of the device used to give consent, defaults to 'Unknown'"),
    consentStatus: ConsentStatusEnum.default(ConsentStatusEnum.Enum.Consented).describe("Current status of the consent, e.g., 'Consented', 'Not Consented', 'Withdrawn'"),
    dataCategories: z.array(DataCategoriesEnum.default(DataCategoriesEnum.Enum.Health_data)).default([DataCategoriesEnum.Enum.Health_data]).describe("Categories of data that the patient has consented to share, e.g., 'Health data', 'Personal identification data', 'Contact information', 'Demographic data'"),
    retentionPeriod: z.number().int().min(0).default(5).describe("Retention period for the patient's data in years, defaults to 5 years"),
    dataProcessingDetails: z.string().min(1).max(500).default("Data will be processed for the purpose of clinical trial management and regulatory compliance").describe("Details on how the patient's data will be processed, stored, and used"),
    timestamp: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Timestamp of when the consent record was created"),
});

export const ComplianceStatusSchema = z.object({
    trialId: z.string().uuid().describe("Unique identifier for the trial associated with this compliance status"),
    gdprCompliant: z.boolean().default(false).describe("Whether the trial is compliant with GDPR regulations"),
    overallCompliance: z.number().min(0).max(100).default(0).describe("Overall compliance percentage of the trial, from 0 to 100"),
    patientCompliance: z.number().min(0).max(100).default(0).describe("Percentage of patients who have given valid GDPR consent, from 0 to 100"),
    siteCompliance: z.number().min(0).max(100).default(0).describe("Percentage of sites that are compliant with regulatory requirements, from 0 to 100"),
    lastUpdated: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Date when the compliance status was last updated"),
});


export const RegulatoryDocumentSchema = z.object({
    id: z.string().uuid().optional().describe("Unique identifier for the document"),
    type: z.string().min(1).describe("Type of document, e.g., 'Protocol', 'Informed Consent', 'Regulatory Approval', 'Other'"),
    url: z.string().url().describe("URL where the document can be accessed"),
    uploadDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Date when the document was uploaded"),
})

export const RegulatoryApprovalSchema = z.object({
    id: z.string().uuid().optional().describe("Unique identifier for the regulatory approval record"),
    status: ApprovalStatusEnum.default(ApprovalStatusEnum.Enum.Approved).describe("Status of the regulatory approval, e.g., 'Approved', 'Pending', 'Rejected'"),
    type: ApprovalTypeEnum.default(ApprovalTypeEnum.Enum.ClinicalTrial).describe("Type of regulatory approval, e.g., 'Clinical Trial', 'Marketing Authorization', 'Device Approval'"),
    trialId: z.string().uuid().describe("Unique identifier for the trial associated with this regulatory approval"),
    authority: z.string().min(1).describe("Name of the regulatory authority that granted the approval"),
    approvalDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Date when the regulatory approval was granted"),
    approvalStatus: ApprovalStatusEnum.default(ApprovalStatusEnum.Enum.Approved).describe("Status of the regulatory approval, e.g., 'Approved', 'Pending', 'Rejected'"),
    documents: z.array(RegulatoryDocumentSchema).default([]).describe("List of documents related to the regulatory approval"),
});

export const ProtocolDeviationSchema = z.object({
    id: z.string().uuid().optional().describe("Unique identifier for the protocol deviation record"),
    trialId: z.string().uuid().describe("Unique identifier for the trial associated with this protocol deviation"),
    description: z.string().min(1).describe("Description of the protocol deviation"),
    dateOccurred: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Date when the protocol deviation occurred"),
    severity: ProtocolDeviationSeverityEnum.default(ProtocolDeviationSeverityEnum.Enum.Minor).describe("Severity of the protocol deviation, e.g., 'Minor', 'Major', 'Critical'"),
    impactAssessment: z.string().optional().describe("Assessment of the impact of the protocol deviation on the trial"),
    correctiveAction: z.string().optional().describe("Corrective action taken in response to the protocol deviation"),
});

export type GDPRConsent = z.infer<typeof GDPRConsentSchema>;
export type ComplianceStatus = z.infer<typeof ComplianceStatusSchema>;
export type RegulatoryDocument = z.infer<typeof RegulatoryDocumentSchema>;
export type RegulatoryApproval = z.infer<typeof RegulatoryApprovalSchema>;
export type ProtocolDeviation = z.infer<typeof ProtocolDeviationSchema>;

