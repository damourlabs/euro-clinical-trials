import { relations } from "drizzle-orm";
import { trials, conditions, criteria, eligibilityConditions, eligibilityCriteria, participantEnrollment } from "..";

export const eligibilityCriteriaRelations = relations(eligibilityCriteria, ({ one, many }) => ({
    trial: one(trials, {
        fields: [eligibilityCriteria.trialUuid],
        references: [trials.uuid],
    }),
    eligibilityConditions: many(eligibilityConditions),
    criteria: many(criteria),
    participantEnrollment: many(participantEnrollment),
}));

export const conditionsRelations = relations(conditions, ({ many }) => ({
    eligibilityConditions: many(eligibilityConditions),
}));

export const eligibilityConditionsRelations = relations(eligibilityConditions, ({ one }) => ({
    eligibilityCriteria: one(eligibilityCriteria, {
        fields: [eligibilityConditions.eligibilityCriteriaUuid],
        references: [eligibilityCriteria.uuid],
    }),
    condition: one(conditions, {
        fields: [eligibilityConditions.conditionUuid],
        references: [conditions.uuid],
    }),
}));

export const criteriaRelations = relations(criteria, ({ one }) => ({
    eligibilityCriteria: one(eligibilityCriteria, {
        fields: [criteria.eligibilityCriteriaUuid],
        references: [eligibilityCriteria.uuid],
    }),
}));

export const participantEnrollmentRelations = relations(participantEnrollment, ({ one }) => ({
    trial: one(trials, {
        fields: [participantEnrollment.trialUuid],
        references: [trials.uuid],
    }),
    eligibilityCriteria: one(eligibilityCriteria, {
        fields: [participantEnrollment.eligibilityCriteriaUuid],
        references: [eligibilityCriteria.uuid],
    }),
}));