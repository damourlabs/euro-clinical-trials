import { z } from "zod"
import { VisitType, SiteStatusEnum, UserRoleEnum } from "./enums"

export const UserSchema = z.object({
    id: z.string().uuid().optional().describe("Unique identifier for the user"),
    name: z.string().min(1).max(100).default("John Doe").describe("Full name of the user, defaults to 'John Doe' if not provided"),
    email: z.string().email().default(() => `user-${Math.random().toString(36).substring(2, 15)}@example.com`).describe("Email address of the user, defaults to a random email if not provided"),
    role: UserRoleEnum.default(UserRoleEnum.Enum.Coordinator).describe("Role of the user in the clinical trial, e.g., Sponsor, Investigator, Coordinator, Monitor, Patient, Nurse"),
    institution: z.string().min(1).max(100).default("Unknown Institution").describe("Institution or organization the user is affiliated with, defaults to 'Unknown Institution' if not provided"),
    phoneNumber: z.string().optional().describe("Phone number of the user, optional field"),
})


export const DocumentSchema = z.object({
    id: z.string().uuid().optional().describe("Unique identifier for the document"),
    title: z.string().min(1).describe("Title of the document"),
    url: z.string().url().describe("URL where the document can be accessed"),
    uploadDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Date when the document was uploaded, defaults to today if not provided"),
    uploadedBy: UserSchema.describe("User who uploaded the document"),
    documentType: z.enum(['protocol', 'informedConsent', 'regulatoryApproval', 'other']).describe("Type of document, e.g., protocol, informed consent, regulatory approval, or other"),
    description: z.string().optional().describe("Optional description of the document"),
})

export const SiteSchema = z.object({
    id: z.string().uuid().describe("Unique identifier for the site"),
    status: SiteStatusEnum.default(SiteStatusEnum.Enum.Active).describe("Current status of the clinical trial site, e.g., Active, Inactive, Closed"),
    trialId: z.string().uuid().describe("Unique identifier for the trial associated with this site"),
    name: z.string().min(1).max(100).default("Default Clinical Trial Site").describe("Name of the clinical trial site, defaults to 'Default Clinical Trial Site' if not provided"),
    address: z.string().min(1).describe("Physical address of the clinical trial site"),
    contactPerson: UserSchema.describe("Contact person at the clinical trial site"),
    patientsEnrolled: z.number().int().min(0).default(0).describe("Number of patients currently enrolled at this site"),
    targetEnrollment: z.number().int().min(0).default(100).describe("Target number of patients to enroll at this site"),
    dataSubmissionStatus: z.enum(['onTime', 'delayed', 'notSubmitted']).default('notSubmitted').describe("Status of data submission from this site"),
    activationDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Date when the site was activated"),
    principalInvestigator: UserSchema.describe("Principal investigator at the site"),
    studyCoordinator: UserSchema.optional().describe("Study coordinator at the site"),
    facilityType: z.enum(['hospital', 'clinic', 'university', 'research_center']).default('hospital').describe("Type of facility"),
    certifications: z.array(z.string()).default([]).describe("List of certifications held by the site"),
    dataCompleteness: z.number().min(0).max(100).default(0).describe("Percentage of data completeness for the site"),
    lastMonitoringVisit: z.string().date().optional().describe("Date of last monitoring visit"),
    nextScheduledVisit: z.string().date().optional().describe("Date of next scheduled visit"),
    protocolDeviations: z.number().int().min(0).default(0).describe("Number of protocol deviations at this site"),
    adverseEventsReported: z.number().int().min(0).default(0).describe("Number of adverse events reported from this site"),
    documents: z.array(DocumentSchema).default([]).describe("Documents associated with the site"),
})

export const VisitSchema = z.object({
    id: z.string().uuid().describe("Unique identifier for the visit"),
    patientId: z.string().uuid().describe("Unique identifier for the patient associated with this visit"),
    siteId: z.string().uuid().describe("Unique identifier for the site where the visit took place"),
    visitDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Date of the visit, defaults to today if not provided"),
    visitType: VisitType.default(VisitType.Enum.Screening).describe("Type of visit, e.g., Screening, Follow-up, Adverse Event Assessment"),
    notes: z.string().optional().describe("Optional notes about the visit"),
})

export type User = z.infer<typeof UserSchema>
export type Document = z.infer<typeof DocumentSchema>
export type Site = z.infer<typeof SiteSchema>
export type Visit = z.infer<typeof VisitSchema>
