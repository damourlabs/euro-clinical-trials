import { relations } from "drizzle-orm";
import { trials, secondaryEndpoints, endpointData, patients, visits, randomizationStrategies, endpoints, stratificationFactors, studyDesigns } from "..";

export const studyDesignsRelations = relations(studyDesigns, ({ one, many }) => ({
    trial: one(trials, {
        fields: [studyDesigns.trialUuid],
        references: [trials.uuid],
    }),
    randomizationStrategy: one(randomizationStrategies, {
        fields: [studyDesigns.randomizationStrategyUuid],
        references: [randomizationStrategies.uuid],
    }),
    primaryEndpoint: one(endpoints, {
        fields: [studyDesigns.primaryEndpointUuid],
        references: [endpoints.uuid],
    }),
    secondaryEndpoints: many(secondaryEndpoints),
}));

export const randomizationStrategiesRelations = relations(randomizationStrategies, ({ many }) => ({
    studyDesigns: many(studyDesigns),
    stratificationFactors: many(stratificationFactors),
}));

export const stratificationFactorsRelations = relations(stratificationFactors, ({ one }) => ({
    randomizationStrategy: one(randomizationStrategies, {
        fields: [stratificationFactors.randomizationStrategyUuid],
        references: [randomizationStrategies.uuid],
    }),
}));

export const endpointsRelations = relations(endpoints, ({ many }) => ({
    primaryStudyDesigns: many(studyDesigns),
    secondaryEndpoints: many(secondaryEndpoints),
    endpointData: many(endpointData),
}));

export const secondaryEndpointsRelations = relations(secondaryEndpoints, ({ one }) => ({
    studyDesign: one(studyDesigns, {
        fields: [secondaryEndpoints.studyDesignUuid],
        references: [studyDesigns.uuid],
    }),
    endpoint: one(endpoints, {
        fields: [secondaryEndpoints.endpointUuid],
        references: [endpoints.uuid],
    }),
}));

export const endpointDataRelations = relations(endpointData, ({ one }) => ({
    endpoint: one(endpoints, {
        fields: [endpointData.endpointUuid],
        references: [endpoints.uuid],
    }),
    patient: one(patients, {
        fields: [endpointData.patientUuid],
        references: [patients.uuid],
    }),
    visit: one(visits, {
        fields: [endpointData.visitUuid],
        references: [visits.uuid],
    }),
}));