-- Seed file for endpoints
-- This file creates study endpoints for trials

INSERT INTO endpoints (
    uuid,
    description,
    measurement_method,
    target_value,
    unit,
    created_at
) VALUES 
-- Cardiovascular Endpoints
('890e8400-e29b-41d4-a716-446655440001', 'Primary cardiovascular endpoint: reduction in systolic blood pressure', 'Automated sphygmomanometer measurement', 140.00, 'mmHg', CURRENT_TIMESTAMP),
('890e8400-e29b-41d4-a716-446655440002', 'Secondary cardiovascular endpoint: diastolic blood pressure reduction', 'Automated sphygmomanometer measurement', 90.00, 'mmHg', CURRENT_TIMESTAMP),
('890e8400-e29b-41d4-a716-446655440003', 'Safety endpoint: heart rate variability', 'ECG monitoring and analysis', 75.00, 'bpm', CURRENT_TIMESTAMP),

-- Oncology Endpoints
('890e8400-e29b-41d4-a716-446655440004', 'Primary oncology endpoint: overall response rate', 'RECIST 1.1 criteria assessment', 30.00, 'percentage', CURRENT_TIMESTAMP),
('890e8400-e29b-41d4-a716-446655440005', 'Secondary oncology endpoint: progression-free survival', 'Radiological assessment and clinical evaluation', 12.00, 'months', CURRENT_TIMESTAMP),
('890e8400-e29b-41d4-a716-446655440006', 'Safety endpoint: treatment-related adverse events', 'CTCAE v5.0 grading system', 25.00, 'percentage', CURRENT_TIMESTAMP),

-- Neurological Endpoints
('890e8400-e29b-41d4-a716-446655440007', 'Primary neurological endpoint: UPDRS motor score improvement', 'Unified Parkinson Disease Rating Scale assessment', 15.00, 'score points', CURRENT_TIMESTAMP),
('890e8400-e29b-41d4-a716-446655440008', 'Secondary neurological endpoint: quality of life assessment', 'PDQ-39 questionnaire scoring', 20.00, 'score points', CURRENT_TIMESTAMP),
('890e8400-e29b-41d4-a716-446655440009', 'Biomarker endpoint: alpha-synuclein levels', 'ELISA immunoassay measurement', 50.00, 'pg/mL', CURRENT_TIMESTAMP),

-- Diabetes Endpoints
('890e8400-e29b-41d4-a716-446655440010', 'Primary diabetes endpoint: HbA1c reduction', 'High-performance liquid chromatography', 7.00, 'percentage', CURRENT_TIMESTAMP),
('890e8400-e29b-41d4-a716-446655440011', 'Secondary diabetes endpoint: fasting glucose levels', 'Glucose oxidase method', 126.00, 'mg/dL', CURRENT_TIMESTAMP),
('890e8400-e29b-41d4-a716-446655440012', 'Safety endpoint: hypoglycemic episodes', 'Patient glucose monitoring logs', 5.00, 'episodes/month', CURRENT_TIMESTAMP),

-- Respiratory Endpoints
('890e8400-e29b-41d4-a716-446655440013', 'Primary respiratory endpoint: FEV1 improvement', 'Spirometry testing', 15.00, 'percentage improvement', CURRENT_TIMESTAMP),
('890e8400-e29b-41d4-a716-446655440014', 'Secondary respiratory endpoint: quality of life', 'SGRQ questionnaire scoring', 4.00, 'score points', CURRENT_TIMESTAMP),
('890e8400-e29b-41d4-a716-446655440015', 'Safety endpoint: respiratory adverse events', 'Clinical assessment and patient reporting', 10.00, 'percentage', CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;
