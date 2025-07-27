import { relations } from "drizzle-orm";
import { documents, patients, protocolDeviations, siteCertifications, sites, trials, userRoles, users, visits } from "..";


// Site Relations
export const sitesRelations = relations(sites, ({ one, many }) => ({
    trial: one(trials, {
        fields: [sites.trialUuid],
        references: [trials.uuid],
    }),
    contactPerson: one(users, {
        fields: [sites.contactPersonUuid],
        references: [users.uuid],
        relationName: 'contactPerson',
    }),
    principalInvestigator: one(users, {
        fields: [sites.principalInvestigatorUuid],
        references: [users.uuid],
        relationName: 'principalInvestigator',
    }),
    studyCoordinator: one(users, {
        fields: [sites.studyCoordinatorUuid],
        references: [users.uuid],
        relationName: 'studyCoordinator',
    }),
    patients: many(patients),
    visits: many(visits),
    certifications: many(siteCertifications),
    protocolDeviations: many(protocolDeviations),
    documents: many(documents),
    userRoles: many(userRoles),
}));

export const siteCertificationsRelations = relations(siteCertifications, ({ one }) => ({
    site: one(sites, {
        fields: [siteCertifications.siteUuid],
        references: [sites.uuid],
    }),
}));
