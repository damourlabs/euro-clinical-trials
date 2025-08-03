-- Seed file for eligibility conditions
-- This file links eligibility criteria to medical conditions

INSERT INTO eligibility_conditions (
    uuid,
    eligibility_criteria_uuid,
    condition_uuid
) VALUES 
-- Cardiovascular Trial - Link to cardiovascular conditions
('800e8400-e29b-41d4-a716-446655440001', '780e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002'), -- CAD
('800e8400-e29b-41d4-a716-446655440002', '780e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001'), -- Hypertension

-- Oncology Trial - Link to cancer conditions
('800e8400-e29b-41d4-a716-446655440003', '780e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440006'), -- Lung Cancer
('800e8400-e29b-41d4-a716-446655440004', '780e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440007'), -- Colorectal Cancer

-- Neurological Trial - Link to Parkinson's
('800e8400-e29b-41d4-a716-446655440005', '780e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440009'), -- Parkinson Disease

-- Diabetes Trial - Link to diabetes
('800e8400-e29b-41d4-a716-446655440006', '780e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440013'), -- Type 2 Diabetes

-- Respiratory Trial - Link to COPD
('800e8400-e29b-41d4-a716-446655440007', '780e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440018') -- COPD

ON CONFLICT (eligibility_criteria_uuid, condition_uuid) DO NOTHING;
