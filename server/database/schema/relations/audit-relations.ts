import { relations } from "drizzle-orm";
import { trials, users, auditLogDetails, gdprConsents, patients, auditLogs } from "..";

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
    trial: one(trials, {
        fields: [auditLogs.trialUuid],
        references: [trials.uuid],
    }),
    user: one(users, {
        fields: [auditLogs.userUuid],
        references: [users.uuid],
    }),
    auditLogDetails: one(auditLogDetails),
}));

export const auditLogDetailsRelations = relations(auditLogDetails, ({ one }) => ({
    auditLog: one(auditLogs, {
        fields: [auditLogDetails.auditLogUuid],
        references: [auditLogs.uuid],
    }),
    consent: one(gdprConsents, {
        fields: [auditLogDetails.consentUuid],
        references: [gdprConsents.uuid],
    }),
    patient: one(patients, {
        fields: [auditLogDetails.patientUuid],
        references: [patients.uuid],
    }),
}));
