import { relations } from "drizzle-orm";
import { auditLogs, dataAnonymizationLog, dataSubjectRequests, documents, sites, trials, userRoles, users } from "..";

// User Relations
export const usersRelations = relations(users, ({ many }) => ({
    sponsoredTrials: many(trials, { relationName: 'sponsor' }),
    investigatedTrials: many(trials, { relationName: 'principalInvestigator' }),
    userRoles: many(userRoles),
    uploadedDocuments: many(documents),
    auditLogs: many(auditLogs),
    processedRequests: many(dataSubjectRequests),
    performedAnonymizations: many(dataAnonymizationLog),
    contactPersonSites: many(sites, { relationName: 'contactPerson' }),
    investigatorSites: many(sites, { relationName: 'principalInvestigator' }),
    coordinatorSites: many(sites, { relationName: 'studyCoordinator' }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
    user: one(users, {
        fields: [userRoles.userUuid],
        references: [users.uuid],
    }),
}));
