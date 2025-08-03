-- Seed file for compliance status
-- This file creates compliance tracking for trials

INSERT INTO compliance_status (
    uuid,
    trial_uuid,
    gdpr_compliant,
    overall_compliance,
    patient_compliance,
    site_compliance,
    last_updated
) VALUES 
-- Cardiovascular Trial Compliance
('850e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', true, 94.5, 96.2, 92.8, CURRENT_DATE),

-- Oncology Trial Compliance
('850e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', true, 91.3, 89.7, 93.1, CURRENT_DATE),

-- Neurological Trial Compliance
('850e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', true, 97.8, 98.5, 97.1, CURRENT_DATE),

-- Diabetes Trial Compliance
('850e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', true, 88.9, 87.2, 90.6, CURRENT_DATE),

-- Respiratory Trial Compliance  
('850e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', true, 93.6, 95.1, 92.1, CURRENT_DATE)

ON CONFLICT (trial_uuid) DO NOTHING;
