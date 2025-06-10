import { z } from "zod";
import { AuditEntrySchema } from "./audits";
import { SiteSchema } from "./admin";
import { RegulatoryApprovalSchema, ComplianceStatusSchema, ProtocolDeviationSchema } from "./regulations"
import { EndpointSchema, ParticipantEnrollmentSchema, RandomizationStrategySchema } from "./study";
import { BlindingEnum, TrialPhaseEnum, TrialStatusEnum } from "./enums";
// Administrative information subschema
export const TrialAdministrativeSchema = z.object({
  sponsorId: z.string().min(1, "Sponsor ID is required").default(() => crypto.randomUUID()).describe("Unique identifier for the sponsor of the trial"),
  principalInvestigatorId: z.string().min(1, "Principal Investigator ID is required").default(() => crypto.randomUUID()).describe("Unique identifier for the principal investigator of the trial"),
  sites: z.array(z.lazy(() => SiteSchema)).default([]).describe("List of clinical trial sites where the trial is being conducted"),
});

export const TrialBasicInfoSchema = z.object({
  eudraCTNumber: z.string().min(1, "EudraCT Number is required").default(() => crypto.randomUUID()).describe("Unique identifier for the trial in the EudraCT database"),
  description: z.string().min(1, "Trial description is required").default("No description provided").describe("Brief description of the clinical trial, including its objectives and scope"),
  id: z.string().uuid().optional().describe("Unique identifier for the trial"),
  indication: z.string().min(1, "Indication is required").default("General Indication").describe("Medical indication for which the trial is being conducted, e.g., 'Diabetes', 'Cancer', etc."),
  phase: TrialPhaseEnum.default(TrialPhaseEnum.Enum.I).describe("Phase of the trial, e.g., Phase I, II, III, or IV"),
  protocolNumber: z.string().min(1, "Protocol number is required").default(() => crypto.randomUUID()).describe("Unique identifier for the trial protocol"),
  title: z.string().min(1, "Trial title is required").default("Untitled Trial").describe("Title of the clinical trial, typically a short descriptive name"),
});



// Regulatory and compliance subschema
export const TrialRegulatoryComplianceSchema = z.object({
  complianceStatus: z.lazy(() => ComplianceStatusSchema).describe("Overall compliance status of the trial, including GDPR and other regulations"),
  regulatoryApprovals: z.array(z.lazy(() => RegulatoryApprovalSchema)).default([]).describe("List of regulatory approvals for the trial"),
  protocolDeviations: z.array(z.lazy(() => ProtocolDeviationSchema)).default([]).describe("List of protocol deviations that have occurred during the trial"),
  auditTrail: z.array(z.lazy(() => AuditEntrySchema)).default([]).describe("Audit trail of actions taken during the trial, including changes to patient data, site information, and regulatory compliance"),
});


// Study design subschema
export const TrialStudyDesignSchema = z.object({
  blinding: BlindingEnum.default(BlindingEnum.Enum.OpenLabel).describe("Type of blinding used in the trial, e.g., single, double, triple, or open label"),
  randomizationStrategy: z.lazy(() => RandomizationStrategySchema).describe("Randomization strategy used in the trial, including type, allocation ratio, block size, and stratification factors"),
  primaryEndpoint: z.lazy(() => EndpointSchema).describe("Primary endpoint of the trial, including its description, measurement method, target value, and unit of measurement"),
  secondaryEndpoints: z.array(z.lazy(() => EndpointSchema)).default([]).describe("List of secondary endpoints of the trial, each with its own description, measurement method, target value, and unit of measurement"),
});

// Timeline and status subschema
export const TrialTimelineSchema = z.object({
  startDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Start date of the trial, defaults to today if not provided"),
  estimatedEndDate: z.string().date().default(() => new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]).describe("Estimated end date of the trial, defaults to one year from today if not provided"),
  actualEndDate: z.string().date().optional().describe("Actual end date of the trial, if completed"),
  status: TrialStatusEnum.default(TrialStatusEnum.Enum.Planning),
});

// Main Trial schema composed of subschemas
export const TrialSchema = z.object({
  id: z.string().uuid().describe("Unique identifier for the trial, automatically generated if not provided"),
  administrative: z.lazy(() => TrialAdministrativeSchema),
  basicInfo: z.lazy(() => TrialBasicInfoSchema),
  participantEnrollment: z.lazy(() => ParticipantEnrollmentSchema),
  regulatoryCompliance: z.lazy(() => TrialRegulatoryComplianceSchema),
  studyDesign: z.lazy(() => TrialStudyDesignSchema),
  timeline: z.lazy(() => TrialTimelineSchema),
});


// Type inference
export type Trial = z.infer<typeof TrialSchema>
export type TrialBasicInfo = z.infer<typeof TrialBasicInfoSchema>;
export type TrialTimeline = z.infer<typeof TrialTimelineSchema>;
export type TrialRegulatoryCompliance = z.infer<typeof TrialRegulatoryComplianceSchema>;
export type TrialStudyDesign = z.infer<typeof TrialStudyDesignSchema>;
export type TrialAdministrative = z.infer<typeof TrialAdministrativeSchema>;
