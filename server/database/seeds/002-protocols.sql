-- Seed file for protocols
-- This file creates sample protocols for clinical trials

INSERT INTO protocols (
    uuid,
    name,
    description,
    created_at
) VALUES 
-- Cardiovascular Protocol
('660e8400-e29b-41d4-a716-446655440001', 
 'CVD-EURO-2025-001', 
 'A comprehensive protocol for evaluating the safety and efficacy of novel cardiovascular interventions in European populations. This protocol includes detailed procedures for patient screening, randomization, data collection, and safety monitoring in compliance with European Medicines Agency guidelines.',
 CURRENT_TIMESTAMP),

-- Oncology Protocol
('660e8400-e29b-41d4-a716-446655440002', 
 'ONC-EURO-2025-002', 
 'Multi-center oncology trial protocol for investigating targeted therapy combinations in advanced solid tumors. The protocol emphasizes biomarker-driven patient selection and incorporates pharmacokinetic studies with real-world evidence collection.',
 CURRENT_TIMESTAMP),

-- Neurological Protocol
('660e8400-e29b-41d4-a716-446655440003', 
 'NEU-EURO-2025-003', 
 'Protocol for evaluating neuroprotective agents in early-stage Parkinson disease. This study design includes comprehensive neurological assessments, biomarker analysis, and long-term safety follow-up in accordance with EMA neurological disease guidelines.',
 CURRENT_TIMESTAMP),

-- Diabetes Protocol
('660e8400-e29b-41d4-a716-446655440004', 
 'DM-EURO-2025-004', 
 'Phase III randomized controlled trial protocol for next-generation diabetes management therapies. The protocol incorporates continuous glucose monitoring, patient-reported outcomes, and health economics endpoints.',
 CURRENT_TIMESTAMP),

-- Respiratory Protocol
('660e8400-e29b-41d4-a716-446655440005', 
 'RESP-EURO-2025-005', 
 'Protocol for chronic obstructive pulmonary disease (COPD) intervention studies. This comprehensive protocol includes pulmonary function testing, quality of life assessments, and exacerbation prevention endpoints.',
 CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;
