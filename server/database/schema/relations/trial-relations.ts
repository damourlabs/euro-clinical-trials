import { relations } from "drizzle-orm";
import { auditLogs, complianceStatus, dataAnonymizationLog, dataRetentionPolicies, documents, eligibilityCriteria, gdprConsents, participantEnrollment, patients, protocolDeviations, regulatoryApprovals, sites, studyDesigns, trialAdministrativeInfo, trials, userRoles, users } from "..";

// Trial Relations
export const trialsRelations = relations(trials, ({ one, many }) => ({
    sponsor: one(users, {
        fields: [trials.sponsorUuid],
        references: [users.uuid],
        relationName: 'sponsor',
    }),
    principalInvestigator: one(users, {
        fields: [trials.principalInvestigatorUuid],
        references: [users.uuid],
        relationName: 'principalInvestigator',
    }),
    administrativeInfo: one(trialAdministrativeInfo),
    studyDesign: one(studyDesigns),
    sites: many(sites),
    patients: many(patients),
    eligibilityCriteria: many(eligibilityCriteria),
    participantEnrollment: one(participantEnrollment),
    regulatoryApprovals: many(regulatoryApprovals),
    complianceStatus: one(complianceStatus),
    protocolDeviations: many(protocolDeviations),
    gdprConsents: many(gdprConsents),
    dataRetentionPolicies: many(dataRetentionPolicies),
    documents: many(documents),
    auditLogs: many(auditLogs),
    dataAnonymizationLog: many(dataAnonymizationLog),
    userRoles: many(userRoles),
}));

export const trialAdministrativeInfoRelations = relations(trialAdministrativeInfo, ({ one }) => ({
    trial: one(trials, {
        fields: [trialAdministrativeInfo.trialUuid],
        references: [trials.uuid],
    }),
    sponsor: one(users, {
        fields: [trialAdministrativeInfo.sponsorUuid],
        references: [users.uuid],
    }),
    principalInvestigator: one(users, {
        fields: [trialAdministrativeInfo.principalInvestigatorUuid],
        references: [users.uuid],
    }),
}));