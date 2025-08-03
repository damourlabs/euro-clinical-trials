-- Seed file for participant enrollment
-- This file tracks enrollment statistics for trials

INSERT INTO participant_enrollment (
    uuid,
    trial_uuid,
    current_enrollment,
    target_enrollment,
    eligibility_criteria_uuid
) VALUES 
-- Cardiovascular Trial Enrollment
('810e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 24, 100, '780e8400-e29b-41d4-a716-446655440001'),

-- Oncology Trial Enrollment
('810e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 18, 75, '780e8400-e29b-41d4-a716-446655440002'),

-- Neurological Trial Enrollment
('810e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 12, 60, '780e8400-e29b-41d4-a716-446655440003'),

-- Diabetes Trial Enrollment
('810e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 32, 120, '780e8400-e29b-41d4-a716-446655440004'),

-- Respiratory Trial Enrollment
('810e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 45, 150, '780e8400-e29b-41d4-a716-446655440005')

ON CONFLICT (trial_uuid) DO NOTHING;
