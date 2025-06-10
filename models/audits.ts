import { z } from "zod";
import { AuditAction, AuditEntityType } from "./enums";

export const AuditEntrySchema = z.object({
    id: z.string().uuid().optional().describe("Unique identifier for the audit entry"),
    trialId: z.string().uuid().optional().describe("Unique identifier for the trial associated with this audit entry"),
    userId: z.string().uuid().optional().describe("Unique identifier for the user who performed the action"),
    action: AuditAction.describe("Action performed that is being audited, e.g., 'Create', 'Update', 'Delete', 'View'"),
    entityType: AuditEntityType.describe("Type of entity being audited, e.g., 'Trial', 'Patient', 'Visit', 'AdverseEvent'"),
    entityId: z.string().uuid().optional().describe("Unique identifier for the entity being audited, e.g., trial ID, patient ID, etc."),
    timestamp: z.string().date().default(() => new Date().toISOString().split('T')[0]).describe("Timestamp of when the action was performed"),
    changes: z.record(z.any()), // Key-value pairs of changed fields
});

export type AuditEntry = z.infer<typeof AuditEntrySchema>;


export const AuditLogDetailsSchema = z.object({
    consentId: z.string().uuid().optional().describe("Unique identifier for the consent record, if applicable"),
    patientId: z.string().uuid().optional().describe("Unique identifier for the patient associated with the audit log"),
    legalBasis: z.string().optional().describe("Legal basis for the action, e.g., 'Consent', 'Contractual necessity', etc."),
});

export type AuditLogDetails = z.infer<typeof AuditLogDetailsSchema>;

export const AuditLogEvent = z.object({
    id: z.string().uuid().optional().describe("Unique identifier for the audit log entry"),
    trialId: z.string().uuid().optional().describe("Unique identifier for the trial associated with this audit log entry"),
    userId: z.string().uuid().optional().describe("Unique identifier for the user who performed the action"),
    action: AuditAction.describe("Action performed that is being logged, e.g., 'Create', 'Update', 'Delete', 'View'"),
    entityType: AuditEntityType.describe("Type of entity being logged, e.g., 'Trial', 'Patient', 'Visit', 'AdverseEvent'"),
    entityId: z.string().uuid().optional().describe("Unique identifier for the entity being logged, e.g., trial ID, patient ID, etc."),
    timestamp: z.string().date().default(() => new Date().toISOString().split('T')[0]).optional().describe("Timestamp of when the action was performed"),
    details: AuditLogDetailsSchema.optional(), // Additional details about the audit log
});

export type AuditLogEvent = z.infer<typeof AuditLogEvent>;
