import { z } from 'zod';
import { CriteriaTypeEnum, RandomizationStrategyEnum, SexEnum } from './enums';
import { RangeSchema } from './utils';
import { PatientSchema } from './patients';

// Study design subschema


export const ParticipantEnrollmentSchema = z.object({
    currentEnrollment: z.number().min(0, "Current enrollment must be a non-negative number").default(0).describe("Current number of patients enrolled in the trial"),
    targetEnrollment: z.number().min(0, "Target enrollment must be a non-negative number").default(100).describe("Target number of patients to be enrolled in the trial"),
    eligibilityCriteria: z.lazy(() => EligibilityCriteriaSchema).describe("Eligibility criteria for enrolling patients in the trial, including age range, conditions, and inclusion/exclusion criteria"),
    patients: z.array(z.lazy(() => PatientSchema)).default([]).describe("List of patients enrolled in the trial, including their demographics, consent status, and visit history"),
});


export const EligibilityCriteriaSchema = z.object({
    ageRange: z.lazy(() => RangeSchema).describe("Age range for eligibility, defined by minimum and maximum age in years"),
    conditions: z.array(z.lazy(() => ConditionSchema)).default([]).describe("List of medical conditions that must be met for eligibility"),
    exclusionCriteria: z.array(z.lazy(() => CriteriaSchema)).default([]).describe("List of exclusion criteria that disqualify a patient from participating in the trial"),
    inclusionCriteria: z.array(z.lazy(() => CriteriaSchema)).default([]).describe("List of inclusion criteria that must be met for a patient to participate in the trial"),
    sex: SexEnum.default(SexEnum.Enum.All).describe("Sex of the patients eligible for the trial")
})

export const ConditionSchema = z.object({
    id: z.string().uuid().min(1, "Condition ID is required").optional().default(() => crypto.randomUUID()).describe("Unique identifier for the condition"),
    name: z.string().min(1, "Condition name is required").describe("Name of the medical condition"),
    description: z.string().max(500, "Condition description must be less than 500 characters").optional().describe("Detailed description of the condition"),
});

export const CriteriaSchema = z.object({
    id: z.string().uuid().min(1, "Criteria ID is required").optional().default(() => crypto.randomUUID()).describe("Unique identifier for the eligibility criteria"),
    description: z.string().min(1, "Criteria description is required").max(500, "Criteria description must be less than 500 characters").describe("Detailed description of the eligibility criteria"),
    criteriaType: CriteriaTypeEnum.default(CriteriaTypeEnum.Enum.Inclusion).describe("Type of criteria, either inclusion or exclusion"),
});

export const RandomizationStrategySchema = z.object({
    type: RandomizationStrategyEnum.default(RandomizationStrategyEnum.Enum.Simple).describe("Type of randomization strategy used in the trial"),
    allocationRatio: z.string().min(1, "Allocation ratio must be a non-empty string").optional().describe("Allocation ratio for the randomization strategy, e.g., '1:1' for equal allocation"),
    blockSize: z.number().min(1, "Block size must be a positive integer").optional().describe("Block size for block randomization, if applicable"),
    stratificationFactors: z.array(z.string().min(1, "Stratification factor must be a non-empty string")).optional().describe("List of stratification factors used in the randomization strategy"),
})


export const EndpointSchema = z.object({
    dataCollected: z.array(z.number()).default([]).describe("Array of data points collected for this endpoint, e.g., measurements taken during the trial"),
    description: z.string().min(1, "Endpoint description is required").max(500, "Endpoint description must be less than 500 characters").default("No description provided").describe("Detailed description of the endpoint, including its significance and how it relates to the trial objectives"),
    id: z.string().uuid().min(1, "Endpoint ID is required").optional().default(() => crypto.randomUUID()).describe("Unique identifier for the endpoint, typically a UUID"),
    measurementMethod: z.string().min(1, "Measurement method is required").max(200, "Measurement method must be less than 200 characters").default("Standard measurement method").describe("Method used to measure the endpoint, e.g., 'Blood pressure measurement', 'Heart rate monitoring', etc."),
    name: z.string().min(1, "Endpoint name is required").max(100, "Endpoint name must be less than 100 characters").default("Unnamed Endpoint").describe("Name of the endpoint, typically a short descriptive title"),
    targetValue: z.number().min(0, "Target value must be a non-negative number").default(0).describe("Target value for the endpoint, e.g., a specific blood pressure reading, heart rate, etc."),
    trialId: z.string().uuid().min(1, "Trial ID is required").default(() => crypto.randomUUID()).describe("Unique identifier for the trial this endpoint belongs to"),
    unit: z.string().min(1, "Unit of measurement is required").max(50, "Unit of measurement must be less than 50 characters").default("mmHg").describe("Unit of measurement for the endpoint, e.g., 'mmHg' for blood pressure, 'bpm' for heart rate, etc."),
});

export type Endpoint = z.infer<typeof EndpointSchema>;
export type RandomizationStrategy = z.infer<typeof RandomizationStrategySchema>;
export type EligibilityCriteria = z.infer<typeof EligibilityCriteriaSchema>;
export type ParticipantEnrollment = z.infer<typeof ParticipantEnrollmentSchema>;