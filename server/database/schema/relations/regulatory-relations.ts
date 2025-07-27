import { relations } from "drizzle-orm";
import { trials, regulatoryDocuments, complianceStatus, protocolDeviations, patients, sites, regulatoryApprovals } from "..";

export const regulatoryApprovalsRelations = relations(regulatoryApprovals, ({ one, many }) => ({
    trial: one(trials, {
        fields: [regulatoryApprovals.trialUuid],
        references: [trials.uuid],
    }),
    regulatoryDocuments: many(regulatoryDocuments),
}));

export const complianceStatusRelations = relations(complianceStatus, ({ one }) => ({
    trial: one(trials, {
        fields: [complianceStatus.trialUuid],
        references: [trials.uuid],
    }),
}));

export const protocolDeviationsRelations = relations(protocolDeviations, ({ one }) => ({
    trial: one(trials, {
        fields: [protocolDeviations.trialUuid],
        references: [trials.uuid],
    }),
    patient: one(patients, {
        fields: [protocolDeviations.patientUuid],
        references: [patients.uuid],
    }),
    site: one(sites, {
        fields: [protocolDeviations.siteUuid],
        references: [sites.uuid],
    }),
}));