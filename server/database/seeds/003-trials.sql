-- Seed file for clinical trials
-- This file creates sample clinical trials for development and testing

INSERT INTO trials (
    uuid,
    title,
    description,
    protocol_uuid,
    indication,
    phase,
    status,
    sponsor_uuid,
    principal_investigator_uuid,
    start_date,
    estimated_end_date,
    actual_end_date,
    created_at,
    updated_at
) VALUES 
-- Cardiovascular Trial
('770e8400-e29b-41d4-a716-446655440001', 
 'CARDIO-PROTECT: Novel ACE Inhibitor in Heart Failure', 
 'A randomized, double-blind, placebo-controlled study evaluating the safety and efficacy of EuroCard-123 in patients with heart failure with reduced ejection fraction. This Phase III trial aims to demonstrate superior cardiovascular outcomes compared to standard care.',
 '660e8400-e29b-41d4-a716-446655440001',
 'Heart Failure with Reduced Ejection Fraction',
 'III',
 'Active',
 '550e8400-e29b-41d4-a716-446655440001', -- Anna Johnson (EuroPharmaCorp)
 '550e8400-e29b-41d4-a716-446655440003', -- Dr. Elena Rossi (UMC Amsterdam)
 '2025-01-15',
 '2027-06-30',
 NULL,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

-- Oncology Trial  
('770e8400-e29b-41d4-a716-446655440002',
 'ONCO-TARGET: Precision Medicine in Advanced NSCLC',
 'A multi-center, open-label, biomarker-driven study investigating combination targeted therapy in advanced non-small cell lung cancer. The trial utilizes next-generation sequencing for patient stratification and includes correlative pharmacokinetic studies.',
 '660e8400-e29b-41d4-a716-446655440002',
 'Non-Small Cell Lung Cancer',
 'II',
 'Active',
 '550e8400-e29b-41d4-a716-446655440002', -- Prof. Marcus Schmidt (BioThera)
 '550e8400-e29b-41d4-a716-446655440004', -- Prof. Hans Mueller (Charité)
 '2024-09-01',
 '2026-12-31',
 NULL,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

-- Neurological Trial
('770e8400-e29b-41d4-a716-446655440003',
 'NEURO-SHIELD: Neuroprotection in Early Parkinson Disease',
 'A Phase II randomized, double-blind, placebo-controlled trial evaluating a novel neuroprotective agent in patients with early-stage Parkinson disease. The study includes comprehensive motor and cognitive assessments with biomarker analysis.',
 '660e8400-e29b-41d4-a716-446655440003',
 'Early Parkinson Disease',
 'II',
 'Active',
 '550e8400-e29b-41d4-a716-446655440001', -- Anna Johnson (EuroPharmaCorp)
 '550e8400-e29b-41d4-a716-446655440005', -- Dr. Marie Dubois (APHP)
 '2024-11-01',
 '2027-04-30',
 NULL,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

-- Diabetes Trial
('770e8400-e29b-41d4-a716-446655440004',
 'DIABETES-NEXT: Advanced Glucose Control Technology',
 'A Phase III randomized controlled trial comparing next-generation continuous glucose monitoring with smart insulin delivery versus standard care in Type 1 diabetes. The study includes quality of life and health economics endpoints.',
 '660e8400-e29b-41d4-a716-446655440004',
 'Type 1 Diabetes Mellitus',
 'III',
 'Planning',
 '550e8400-e29b-41d4-a716-446655440002', -- Prof. Marcus Schmidt (BioThera)
 '550e8400-e29b-41d4-a716-446655440003', -- Dr. Elena Rossi (UMC Amsterdam)
 '2025-03-01',
 '2027-08-31',
 NULL,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

-- Respiratory Trial
('770e8400-e29b-41d4-a716-446655440005',
 'BREATHE-EASY: COPD Exacerbation Prevention',
 'A Phase III double-blind, placebo-controlled study of a novel bronchodilator combination in moderate to severe COPD. The trial focuses on exacerbation prevention with comprehensive pulmonary function and quality of life assessments.',
 '660e8400-e29b-41d4-a716-446655440005',
 'Chronic Obstructive Pulmonary Disease',
 'III',
 'Completed',
 '550e8400-e29b-41d4-a716-446655440001', -- Anna Johnson (EuroPharmaCorp)
 '550e8400-e29b-41d4-a716-446655440004', -- Prof. Hans Mueller (Charité)
 '2023-06-01',
 '2025-01-31',
 '2025-01-31',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;
