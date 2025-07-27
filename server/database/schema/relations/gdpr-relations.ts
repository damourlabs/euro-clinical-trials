import { relations } from "drizzle-orm";
import { users, gdprConsents, trials, patients, gdprDataCategories, auditLogDetails, dataRetentionPolicies, dataSubjectRequests, dataAnonymizationLog } from "..";

export const gdprConsentsRelations = relations(gdprConsents, ({ one, many }) => ({
    trial: one(trials, {
        fields: [gdprConsents.trialUuid],
        references: [trials.uuid],
    }),
    patient: one(patients, {
        fields: [gdprConsents.patientUuid],
        references: [patients.uuid],
    }),
    dataCategories: many(gdprDataCategories),
    auditLogDetails: many(auditLogDetails),
}));

export const gdprDataCategoriesRelations = relations(gdprDataCategories, ({ one }) => ({
    consent: one(gdprConsents, {
        fields: [gdprDataCategories.consentUuid],
        references: [gdprConsents.uuid],
    }),
}));

export const dataRetentionPoliciesRelations = relations(dataRetentionPolicies, ({ one }) => ({
    trial: one(trials, {
        fields: [dataRetentionPolicies.trialUuid],
        references: [trials.uuid],
    }),
}));

export const dataSubjectRequestsRelations = relations(dataSubjectRequests, ({ one }) => ({
    patient: one(patients, {
        fields: [dataSubjectRequests.patientUuid],
        references: [patients.uuid],
    }),
    processedBy: one(users, {
        fields: [dataSubjectRequests.processedBy],
        references: [users.uuid],
    }),
}));

export const dataAnonymizationLogRelations = relations(dataAnonymizationLog, ({ one }) => ({
    trial: one(trials, {
        fields: [dataAnonymizationLog.trialUuid],
        references: [trials.uuid],
    }),
    performedBy: one(users, {
        fields: [dataAnonymizationLog.performedBy],
        references: [users.uuid],
    }),
}));