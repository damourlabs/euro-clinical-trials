-- Seed file for criteria
-- This file creates specific inclusion/exclusion criteria for trials

INSERT INTO criteria (
    uuid,
    eligibility_criteria_uuid,
    description,
    criteria_type,
    created_at
) VALUES 
-- Cardiovascular Trial Criteria
('790e8400-e29b-41d4-a716-446655440001', '780e8400-e29b-41d4-a716-446655440001', 'Confirmed diagnosis of coronary artery disease', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440002', '780e8400-e29b-41d4-a716-446655440001', 'Stable clinical condition for at least 3 months', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440003', '780e8400-e29b-41d4-a716-446655440001', 'Previous myocardial infarction within 6 months', 'Exclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440004', '780e8400-e29b-41d4-a716-446655440001', 'Uncontrolled hypertension (>180/110 mmHg)', 'Exclusion', CURRENT_TIMESTAMP),

-- Oncology Trial Criteria
('790e8400-e29b-41d4-a716-446655440005', '780e8400-e29b-41d4-a716-446655440002', 'Histologically confirmed advanced solid tumor', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440006', '780e8400-e29b-41d4-a716-446655440002', 'ECOG performance status 0-2', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440007', '780e8400-e29b-41d4-a716-446655440002', 'Adequate organ function', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440008', '780e8400-e29b-41d4-a716-446655440002', 'Active brain metastases', 'Exclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440009', '780e8400-e29b-41d4-a716-446655440002', 'Pregnancy or lactation', 'Exclusion', CURRENT_TIMESTAMP),

-- Neurological Trial Criteria
('790e8400-e29b-41d4-a716-446655440010', '780e8400-e29b-41d4-a716-446655440003', 'Clinical diagnosis of Parkinson disease', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440011', '780e8400-e29b-41d4-a716-446655440003', 'Hoehn and Yahr stage 1-3', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440012', '780e8400-e29b-41d4-a716-446655440003', 'Stable medication regimen for 4 weeks', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440013', '780e8400-e29b-41d4-a716-446655440003', 'Significant cognitive impairment (MMSE <24)', 'Exclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440014', '780e8400-e29b-41d4-a716-446655440003', 'History of deep brain stimulation', 'Exclusion', CURRENT_TIMESTAMP),

-- Diabetes Trial Criteria
('790e8400-e29b-41d4-a716-446655440015', '780e8400-e29b-41d4-a716-446655440004', 'Type 2 diabetes diagnosed ≥1 year', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440016', '780e8400-e29b-41d4-a716-446655440004', 'HbA1c between 7.0-10.5%', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440017', '780e8400-e29b-41d4-a716-446655440004', 'Stable metformin therapy ≥3 months', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440018', '780e8400-e29b-41d4-a716-446655440004', 'Type 1 diabetes or MODY', 'Exclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440019', '780e8400-e29b-41d4-a716-446655440004', 'Severe diabetic complications', 'Exclusion', CURRENT_TIMESTAMP),

-- Respiratory Trial Criteria (replacing breast/prostate cancer since we only have 5 trials)
('790e8400-e29b-41d4-a716-446655440020', '780e8400-e29b-41d4-a716-446655440005', 'Confirmed diagnosis of moderate to severe COPD', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440021', '780e8400-e29b-41d4-a716-446655440005', 'FEV1 between 30-80% predicted', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440022', '780e8400-e29b-41d4-a716-446655440005', 'History of exacerbations in past year', 'Inclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440023', '780e8400-e29b-41d4-a716-446655440005', 'Active respiratory infection', 'Exclusion', CURRENT_TIMESTAMP),
('790e8400-e29b-41d4-a716-446655440024', '780e8400-e29b-41d4-a716-446655440005', 'Recent hospitalization for respiratory failure', 'Exclusion', CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;
