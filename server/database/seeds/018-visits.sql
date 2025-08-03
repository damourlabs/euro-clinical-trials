-- Seed file for visits
-- This file creates patient visits for clinical trials

INSERT INTO visits (
    uuid,
    patient_uuid,
    site_uuid,
    visit_date,
    visit_type,
    status,
    notes,
    created_at,
    updated_at
) VALUES 
-- Cardiovascular Trial Visits (Patient CARDIO-001-001)
('830e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '2025-01-22', 'Screening', 'Completed', 'Initial screening visit completed successfully. All inclusion criteria met.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('830e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '2025-02-05', 'Baseline', 'Completed', 'Baseline assessments and randomization completed.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('830e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '2025-02-19', 'Follow-up', 'Completed', 'Week 2 follow-up. Patient tolerating treatment well.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('830e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '2025-03-05', 'Follow-up', 'Scheduled', 'Week 4 follow-up visit scheduled.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Cardiovascular Trial Visits (Patient CARDIO-001-002)
('830e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', '2025-01-24', 'Screening', 'Completed', 'Screening completed. Patient meets all eligibility criteria.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('830e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', '2025-02-07', 'Baseline', 'Completed', 'Baseline visit and treatment initiation.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Oncology Trial Visits (Patient ONCO-001-001)
('830e8400-e29b-41d4-a716-446655440007', '990e8400-e29b-41d4-a716-446655440010', '880e8400-e29b-41d4-a716-446655440004', '2024-09-17', 'Screening', 'Completed', 'Comprehensive oncology screening completed.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('830e8400-e29b-41d4-a716-446655440008', '990e8400-e29b-41d4-a716-446655440010', '880e8400-e29b-41d4-a716-446655440004', '2024-10-01', 'Baseline', 'Completed', 'Baseline imaging and laboratory assessments completed.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('830e8400-e29b-41d4-a716-446655440009', '990e8400-e29b-41d4-a716-446655440010', '880e8400-e29b-41d4-a716-446655440004', '2024-10-15', 'Treatment', 'Completed', 'Cycle 1 Day 1 treatment administration.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Neurological Trial Visits (Patient NEURO-001-001)
('830e8400-e29b-41d4-a716-446655440010', '990e8400-e29b-41d4-a716-446655440017', '880e8400-e29b-41d4-a716-446655440007', '2024-11-17', 'Screening', 'Completed', 'Neurological assessment and cognitive testing completed.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('830e8400-e29b-41d4-a716-446655440011', '990e8400-e29b-41d4-a716-446655440017', '880e8400-e29b-41d4-a716-446655440007', '2024-12-01', 'Baseline', 'Completed', 'Baseline motor function assessments completed.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Respiratory Trial Visits (Patient BREATHE-001-001)
('830e8400-e29b-41d4-a716-446655440012', '990e8400-e29b-41d4-a716-446655440022', '880e8400-e29b-41d4-a716-446655440010', '2023-06-17', 'Screening', 'Completed', 'Respiratory function screening completed.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('830e8400-e29b-41d4-a716-446655440013', '990e8400-e29b-41d4-a716-446655440022', '880e8400-e29b-41d4-a716-446655440010', '2023-07-01', 'Baseline', 'Completed', 'Baseline pulmonary function tests completed.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('830e8400-e29b-41d4-a716-446655440014', '990e8400-e29b-41d4-a716-446655440022', '880e8400-e29b-41d4-a716-446655440010', '2023-07-15', 'Follow-up', 'Completed', 'Week 2 follow-up visit completed.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;
