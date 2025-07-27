import { relations } from "drizzle-orm";
import { adverseEvents, patients } from "..";

export const adverseEventsRelations = relations(adverseEvents, ({ one }) => ({
    patient: one(patients, {
        fields: [adverseEvents.patientUuid],
        references: [patients.uuid],
    }),
}));