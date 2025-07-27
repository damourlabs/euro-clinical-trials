import { relations } from "drizzle-orm";
import { users, documents, trials, sites, regulatoryDocuments, regulatoryApprovals } from "..";

export const documentsRelations = relations(documents, ({ one, many }) => ({
    uploadedBy: one(users, {
        fields: [documents.uploadedBy],
        references: [users.uuid],
    }),
    trial: one(trials, {
        fields: [documents.trialUuid],
        references: [trials.uuid],
    }),
    site: one(sites, {
        fields: [documents.siteUuid],
        references: [sites.uuid],
    }),
    regulatoryDocuments: many(regulatoryDocuments),
}));

export const regulatoryDocumentsRelations = relations(regulatoryDocuments, ({ one }) => ({
    regulatoryApproval: one(regulatoryApprovals, {
        fields: [regulatoryDocuments.regulatoryApprovalUuid],
        references: [regulatoryApprovals.uuid],
    }),
    document: one(documents, {
        fields: [regulatoryDocuments.documentUuid],
        references: [documents.uuid],
    }),
}));
