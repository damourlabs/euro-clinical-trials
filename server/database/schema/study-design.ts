// Drizzle ORM schema for Study Design tables
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  check,
  unique,
  pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import type { Expect, IsSameType } from '~/types/equality';

import { trials, patients, visits } from '.';
import { BlindingEnum, RandomizationStrategyEnum } from './enums';

// --------------------------------
// --- Randomization Strategies ---
// --------------------------------

const randomizationStrategiesDefaultValues = {
  type: RandomizationStrategyEnum.Enum.Simple,
}

export const pgRandomizationStrategy = pgEnum('randomization_strategy_enum', RandomizationStrategyEnum.options);

export const randomizationStrategies = pgTable('randomization_strategies', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  type: pgRandomizationStrategy("randomization_strategy").notNull().default(randomizationStrategiesDefaultValues.type),
  allocationRatio: varchar('allocation_ratio', { length: 10 }),
  blockSize: integer('block_size'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  check('randomization_strategies_block_size_positive', sql`${table.blockSize} IS NULL OR ${table.blockSize} > 0`),
]);

// Zod schemas for validation
export const randomizationStrategiesSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the randomization strategy, automatically generated if not provided")
  ,
  type: RandomizationStrategyEnum
    .describe("Type of randomization strategy")
    .default(randomizationStrategiesDefaultValues.type)
  ,
  allocationRatio: z.string()
    .max(10)
    .nullable()
    .describe("Allocation ratio for the randomization")
  ,
  blockSize: z.number()
    .int()
    .positive()
    .nullable()
    .describe("Block size for block randomization")
  ,
  createdAt: z.date()
    .nullable()
    .describe("Timestamp of when the strategy was created")
  ,
});

// ------------------------------
// --- Stratification Factors ---
// ------------------------------

export const stratificationFactors = pgTable('stratification_factors', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  randomizationStrategyUuid: uuid('randomization_strategy_uuid').notNull().references(() => randomizationStrategies.uuid, { onDelete: 'cascade' }),
  factorName: varchar('factor_name', { length: 100 }).notNull(),
}, (table) => [
  check('stratification_factors_name_not_empty', sql`LENGTH(TRIM(${table.factorName})) > 0`),
  unique('stratification_factors_unique_per_strategy').on(table.randomizationStrategyUuid, table.factorName),
]);

export const stratificationFactorsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the stratification factor, automatically generated if not provided")
  ,
  randomizationStrategyUuid: z.string()
    .uuid()
    .describe("UUID of the randomization strategy this factor belongs to")
  ,
  factorName: z.string()
    .max(100)
    .min(1)
    .describe("Name of the stratification factor")
  ,
});

// -----------------
// --- Endpoints ---
// -----------------

const endpointFieldDefaultValues = {
  description: 'No description provided',
  measurementMethod: 'Not specified',
  unit: 'Not specified',
};

export const endpoints = pgTable('endpoints', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  description: text('description').notNull().default(endpointFieldDefaultValues.description),
  measurementMethod: varchar('measurement_method', { length: 255 }).notNull(),
  targetValue: decimal('target_value', { precision: 10, scale: 2 }),
  unit: varchar('unit', { length: 50 }).notNull().default(endpointFieldDefaultValues.unit),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  check('endpoints_description_not_empty', sql`LENGTH(TRIM(${table.description})) > 0`),
  check('endpoints_unit_not_empty', sql`LENGTH(TRIM(${table.unit})) > 0`),
]);


export const endpointsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the endpoint, automatically generated if not provided")
  ,
  description: z.string()
    .min(1)
    .describe("Description of the endpoint")
    .default(endpointFieldDefaultValues.description)
  ,
  measurementMethod: z.string()
    .max(255)
    .describe("Method used to measure this endpoint")
  ,
  targetValue: z.string()
    .nullable()
    .describe("Target value for this endpoint")
  ,
  unit: z.string()
    .max(50)
    .min(1)
    .describe("Unit of measurement for this endpoint")
    .default(endpointFieldDefaultValues.unit)
  ,
  createdAt: z.date()
    .nullable()
    .describe("Timestamp of when the endpoint was created")
  ,
});


// ---------------------------
// --- Study Design Fields ---
// ---------------------------

export const studyDesignFieldDefaultValues = {
  blinding: BlindingEnum.Enum.OpenLabel,
};

export const pgBlinding = pgEnum('blinding_enum', BlindingEnum.options);

export const studyDesigns = pgTable('study_designs', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  trialUuid: uuid('trial_uuid').notNull().unique().references(() => trials.uuid, { onDelete: 'cascade' }),
  blinding: pgBlinding("blinding").notNull().default(studyDesignFieldDefaultValues.blinding),
  randomizationStrategyUuid: uuid('randomization_strategy_uuid').notNull().references(() => randomizationStrategies.uuid, { onDelete: 'restrict' }),
  primaryEndpointUuid: uuid('primary_endpoint_uuid').notNull().references(() => endpoints.uuid, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, () => []);


export const studyDesignsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the study design, automatically generated if not provided")
  ,
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial this design belongs to")
  ,
  blinding: z.enum(['Single', 'Double', 'Triple', 'OpenLabel'])
    .describe("Type of blinding used in the study")
    .default(studyDesignFieldDefaultValues.blinding)
  ,
  randomizationStrategyUuid: z.string()
    .uuid()
    .describe("UUID of the randomization strategy")
  ,
  primaryEndpointUuid: z.string()
    .uuid()
    .describe("UUID of the primary endpoint")
  ,
  createdAt: z.date()
    .describe("Timestamp of when the design was created")
  ,
  updatedAt: z.date()
    .describe("Timestamp of when the design was last updated")
  ,
});

// ---------------------------
// --- Secondary Endpoints ---
// ---------------------------

export const secondaryEndpoints = pgTable('secondary_endpoints', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  studyDesignUuid: uuid('study_design_uuid').notNull().references(() => studyDesigns.uuid, { onDelete: 'cascade' }),
  endpointUuid: uuid('endpoint_uuid').notNull().references(() => endpoints.uuid, { onDelete: 'cascade' }),
}, (table) => [
  unique('secondary_endpoints_unique_per_design').on(table.studyDesignUuid, table.endpointUuid),
]);


export const secondaryEndpointsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the secondary endpoint link, automatically generated if not provided")
  ,
  studyDesignUuid: z.string()
    .uuid()
    .describe("UUID of the study design this endpoint belongs to")
  ,
  endpointUuid: z.string()
    .uuid()
    .describe("UUID of the endpoint")
  ,
});


// ---------------------
// --- Endpoint Data ---
// ---------------------

export const endpointData = pgTable('endpoint_data', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  endpointUuid: uuid('endpoint_uuid').notNull().references(() => endpoints.uuid, { onDelete: 'cascade' }),
  patientUuid: uuid('patient_uuid').notNull().references(() => patients.uuid, { onDelete: 'cascade' }),
  visitUuid: uuid('visit_uuid').references(() => visits.uuid, { onDelete: 'cascade' }),
  value: decimal('value', { precision: 15, scale: 4 }).notNull(),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  unique('endpoint_data_unique_per_visit').on(table.endpointUuid, table.patientUuid, table.visitUuid)
]);

export const endpointDataSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the endpoint data, automatically generated if not provided")
  ,
  endpointUuid: z.string()
    .uuid()
    .describe("UUID of the endpoint this data belongs to")
  ,
  patientUuid: z.string()
    .uuid()
    .describe("UUID of the patient")
  ,
  visitUuid: z.string()
    .uuid()
    .nullable()
    .describe("UUID of the visit when this data was recorded")
  ,
  value: z.string()
    .describe("Value measured for this endpoint")
  ,
  recordedAt: z.date()
    .nullable()
    .describe("Timestamp when the data was recorded")
  ,
});

// -----------------
// --- Protocols ---
// -----------------

export const protocols = pgTable('protocols', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  unique('protocols_unique_per_trial').on(table.uuid, table.name),
]);

export const protocolsSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the protocol, automatically generated if not provided")
  ,
  name: z.string()
    .max(255)
    .min(1)
    .describe("Name of the protocol")
  ,
  description: z.string()
    .min(1)
    .describe("Description of the protocol")
  ,
  createdAt: z.date()
    .nullable()
    .describe("Timestamp of when the protocol was created")
  ,
});


export type RandomizationStrategy = z.infer<typeof randomizationStrategiesSchema>;
export type StratificationFactor = z.infer<typeof stratificationFactorsSchema>;
export type Endpoint = z.infer<typeof endpointsSchema>;
export type StudyDesign = z.infer<typeof studyDesignsSchema>;
export type SecondaryEndpoint = z.infer<typeof secondaryEndpointsSchema>;
export type EndpointData = z.infer<typeof endpointDataSchema>;
export type Protocol = z.infer<typeof protocolsSchema>;

type _randomizationStrategySchemaMatchesTable = Expect<IsSameType<RandomizationStrategy, typeof randomizationStrategies.$inferSelect>>
type _stratificationFactorSchemaMatchesTable = Expect<IsSameType<StratificationFactor, typeof stratificationFactors.$inferSelect>>
type _endpointSchemaMatchesTable = Expect<IsSameType<Endpoint, typeof endpoints.$inferSelect>>
type _studyDesignSchemaMatchesTable = Expect<IsSameType<StudyDesign, typeof studyDesigns.$inferSelect>>
type _secondaryEndpointSchemaMatchesTable = Expect<IsSameType<SecondaryEndpoint, typeof secondaryEndpoints.$inferSelect>>
type _endpointDataSchemaMatchesTable = Expect<IsSameType<EndpointData, typeof endpointData.$inferSelect>>
type _protocolSchemaMatchesTable = Expect<IsSameType<Protocol, typeof protocols.$inferSelect>>