import { relations } from "drizzle-orm";
import { visits, vitalSigns, adverseEvents, endpointData, protocolDeviations, gdprConsents, dataSubjectRequests, auditLogDetails, sites, patients, trials } from "..";

export const patientsRelations = relations(patients, ({ one, many }) => ({
    trial: one(trials, {
        fields: [patients.trialUuid],
        references: [trials.uuid],
    }),
    site: one(sites, {
        fields: [patients.siteUuid],
        references: [sites.uuid],
    }),
    visits: many(visits),
    vitalSigns: many(vitalSigns),
    adverseEvents: many(adverseEvents),
    gdprConsents: many(gdprConsents),
    endpointData: many(endpointData),
    protocolDeviations: many(protocolDeviations),
    dataSubjectRequests: many(dataSubjectRequests),
    auditLogDetails: many(auditLogDetails),
}));

export const visitsRelations = relations(visits, ({ one, many }) => ({
    patient: one(patients, {
        fields: [visits.patientUuid],
        references: [patients.uuid],
    }),
    site: one(sites, {
        fields: [visits.siteUuid],
        references: [sites.uuid],
    }),
    vitalSigns: many(vitalSigns),
    endpointData: many(endpointData),
}));

export const vitalSignsRelations = relations(vitalSigns, ({ one }) => ({
    patient: one(patients, {
        fields: [vitalSigns.patientUuid],
        references: [patients.uuid],
    }),
    visit: one(visits, {
        fields: [vitalSigns.visitUuid],
        references: [visits.uuid],
    }),
}));