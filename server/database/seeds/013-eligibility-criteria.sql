-- Seed file for eligibility criteria
-- This file creates eligibility criteria for trials

INSERT INTO eligibility_criteria (
    uuid,
    trial_uuid,
    min_age,
    max_age,
    sex,
    created_at
) VALUES 
-- Cardiovascular Trial Eligibility
('780e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 18, 75, 'All', CURRENT_TIMESTAMP),

-- Oncology Trial Eligibility 
('780e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 18, 80, 'All', CURRENT_TIMESTAMP),

-- Neurological Trial Eligibility
('780e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 50, 85, 'All', CURRENT_TIMESTAMP),

-- Diabetes Trial Eligibility
('780e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 21, 70, 'All', CURRENT_TIMESTAMP),

-- Respiratory Trial Eligibility 
('780e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 40, 80, 'All', CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;
