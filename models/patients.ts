import { z } from 'zod';
import { GDPRConsentSchema } from './regulations';
import { VisitSchema } from './admin';
import { AEOutcomeEnum, AESeverityEnum, ConsentStatusEnum, PatientStatusEnum } from './enums';

export const PatientSchema = z.object({
    status: PatientStatusEnum.default(PatientStatusEnum.Enum.Active).describe("Current status of the patient in the trial"),
    adverseEvents: z.array(z.lazy(() => AdverseEventSchema)).default([]).describe("List of adverse events reported by the patient"),
    consentStatus: ConsentStatusEnum.default(ConsentStatusEnum.Enum.NotConsented).describe("Consent status of the patient for data processing and participation in the trial"),
    dataCompleteness: z.number().min(0).max(100).default(0).describe("Percentage of data completeness for the patient"),
    enrollmentDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).optional().describe("Date when the patient was enrolled in the trial, defaults to today if not provided"),
    gdprConsent: z.lazy(() => GDPRConsentSchema).describe("GDPR consent information for the patient"),
    id: z.string().uuid().describe("Unique identifier for the patient"),
    randomizationGroup: z.string().optional().describe("Randomization group the patient belongs to, if applicable"),
    subjectId: z.string().optional().describe("Reference to the subject in the trial, if applicable"),
    trialId: z.string().uuid().min(1, "Trial ID is required").describe("Unique identifier for the trial this patient is enrolled in"),
    visits: z.array(z.lazy(() => VisitSchema)).default([]).describe("List of visits associated with the patient"),
    withdrawalDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).optional().describe("Date when the patient withdrew from the trial, if applicable"),
});


export const AdverseEventSchema = z.object({
    description: z.string().min(1, "Adverse event description is required").max(500, "Adverse event description must be less than 500 characters").describe("Description of the adverse event reported by the patient"),
    eventDate: z.string().date().default(() => new Date().toISOString().split('T')[0]).optional().describe("Date when the adverse event occurred, defaults to today if not provided"),
    id: z.string().uuid().optional().describe("Unique identifier for the adverse event"),
    outcome: AEOutcomeEnum.default(AEOutcomeEnum.Enum.Resolved).describe("Outcome of the adverse event, indicating whether it has resolved or not"),
    patientId: z.string().uuid().min(1, "Patient ID is required").describe("Unique identifier for the patient who reported the adverse event"),
    relatedToTrial: z.boolean().default(false).describe("Indicates whether the adverse event is related to the trial treatment or procedure"),
    severity: AESeverityEnum.default(AESeverityEnum.Enum.Mild).describe("Severity of the adverse event, indicating its impact on the patient's health"),
});

// Max values for bloodpressure from https://doi.org/10.1016/s0003-9993(95)80578-8 (1995)
export const BloodPressureSchema = z.object({
    systolic: z.number().min(0, "Systolic blood pressure must be a non-negative number").max(370, "Systolic blood pressure must be less than 370 mmHg").optional().describe("Systolic blood pressure reading in mmHg"),
    diastolic: z.number().min(0, "Diastolic blood pressure must be a non-negative number").max(360, "Diastolic blood pressure must be less than 360 mmHg").optional().describe("Diastolic blood pressure reading in mmHg"),
});


export const VitalSignsSchema = z.object({
    heartRate: z.number().min(0, "Heart rate must be a non-negative number").max(300, "Heart rate must be less than 300 bpm").optional().describe("Heart rate in beats per minute"),
    bloodPressure: BloodPressureSchema.optional(),
    temperature: z.number().min(30, "Temperature must be at least 30°C").max(45, "Temperature must be less than 45°C").optional().describe("Body temperature in degrees Celsius"),
    respiratoryRate: z.number().min(0, "Respiratory rate must be a non-negative number").max(100, "Respiratory rate must be less than 100 breaths per minute").optional().describe("Respiratory rate in breaths per minute"),
    oxygenSaturation: z.number().min(0, "Oxygen saturation must be a non-negative number").max(100, "Oxygen saturation must be less than or equal to 100%").optional().describe("Oxygen saturation percentage"),
});


export const PatientStatisticsSchema = z.object({
    totalPatients: z.number().int().min(0).describe("Total number of patients enrolled in the trial"),
    activePatients: z.number().int().min(0).describe("Number of patients currently active in the trial"),
    completedPatients: z.number().int().min(0).describe("Number of patients who have completed the trial"),
    withdrawnPatients: z.number().int().min(0).describe("Number of patients who have withdrawn from the trial"),
    patientsByStatus: z.record(PatientStatusEnum, z.number().int().min(0)).describe("Count of patients grouped by their current status in the trial"),
    enrollmentTrend: z.array(z.lazy(() => EnrollmentTrendSchema)).describe("Trend of patient enrollments over time, with date and count")
});

export const EnrollmentTrendSchema = z.array(z.object({
    date: z.string().date().describe("Date of the enrollment trend entry"),
    count: z.number().int().min(0).describe("Number of patients enrolled on that date")
})).describe("Trend of patient enrollments over time, with date and count");

export type PatientStatistics = z.infer<typeof PatientStatisticsSchema>;
export type EnrollmentTrend = z.infer<typeof EnrollmentTrendSchema>;
export type VitalSigns = z.infer<typeof VitalSignsSchema>;
export type AdverseEvent = z.infer<typeof AdverseEventSchema>;
export type Patient = z.infer<typeof PatientSchema>;
export type BloodPressure = z.infer<typeof BloodPressureSchema>;
