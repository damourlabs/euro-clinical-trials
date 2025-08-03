-- Seed file for adverse events
-- This file creates sample adverse events for development and testing

INSERT INTO adverse_events (
    uuid,
    patient_uuid,
    description,
    event_date,
    adverse_event_severity,
    adverse_event_outcome,
    related_to_trial,
    reported_at,
    resolved_at,
    created_at,
    updated_at
) VALUES 
-- Adverse events for CARDIO-PROTECT trial patients
('cc0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'Mild dizziness reported 2 hours after study drug administration. Patient remained stable, vital signs normal. Resolved spontaneously within 4 hours.', '2025-02-15', 'Mild', 'Resolved', true, '2025-02-15 14:30:00+00', '2025-02-15 18:30:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'Upper respiratory tract infection with mild cough and low-grade fever. Unrelated to study medication according to investigator assessment.', '2025-03-10', 'Mild', 'Resolved', false, '2025-03-10 09:15:00+00', '2025-03-17 09:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440006', 'Transient hypotension observed during routine visit. Blood pressure returned to baseline after dose adjustment. Possibly related to study drug.', '2025-04-05', 'Moderate', 'Resolved', true, '2025-04-05 11:20:00+00', '2025-04-12 10:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440008', 'Mild headache lasting approximately 6 hours. Patient took over-the-counter analgesic with relief. Temporal relationship with study drug noted.', '2025-05-20', 'Mild', 'Resolved', true, '2025-05-20 16:45:00+00', '2025-05-20 22:45:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Adverse events for ONCO-TARGET trial patients
('cc0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440010', 'Grade 2 fatigue developing over the first week of treatment. Managed with dose reduction and supportive care. Ongoing monitoring.', '2024-10-01', 'Moderate', 'Ongoing', true, '2024-10-01 08:30:00+00', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440011', 'Mild nausea occurring within 2 hours of study drug administration. Resolved with anti-emetic medication. Treatment continued without modification.', '2024-10-15', 'Mild', 'Resolved', true, '2024-10-15 14:20:00+00', '2024-10-15 18:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440007', '990e8400-e29b-41d4-a716-446655440012', 'Skin rash on arms and torso, Grade 1. Appeared 5 days after treatment initiation. Managed with topical corticosteroids, resolved completely.', '2024-11-03', 'Mild', 'Resolved', true, '2024-11-03 10:15:00+00', '2024-11-10 09:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440008', '990e8400-e29b-41d4-a716-446655440013', 'Progressive disease requiring discontinuation of study treatment. Patient transitioned to standard of care. Unrelated to study drug per investigator.', '2025-01-20', 'Severe', 'Ongoing', false, '2025-01-20 13:45:00+00', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440009', '990e8400-e29b-41d4-a716-446655440014', 'Transient elevation in liver enzymes (ALT 2.5x ULN). Dose held temporarily, enzymes normalized within 2 weeks. Treatment resumed at reduced dose.', '2024-12-08', 'Moderate', 'Resolved', true, '2024-12-08 11:30:00+00', '2024-12-22 10:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Adverse events for NEURO-SHIELD trial patients
('cc0e8400-e29b-41d4-a716-446655440010', '990e8400-e29b-41d4-a716-446655440017', 'Mild confusion episode lasting approximately 30 minutes during clinic visit. Resolved spontaneously. Possibly related to underlying disease progression.', '2024-12-15', 'Mild', 'Resolved', false, '2024-12-15 15:20:00+00', '2024-12-15 15:50:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440011', '990e8400-e29b-41d4-a716-446655440018', 'Fall at home resulting in minor bruising on right hip. Patient reported mild dizziness before fall. Assessment for relationship to study drug ongoing.', '2025-01-08', 'Moderate', 'Resolved', true, '2025-01-08 19:30:00+00', '2025-01-15 10:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440012', '990e8400-e29b-41d4-a716-446655440020', 'Vivid dreams and sleep disturbance reported starting 3 days after treatment initiation. Symptoms improved with dose timing adjustment.', '2024-12-10', 'Mild', 'Resolved', true, '2024-12-10 12:00:00+00', '2024-12-18 09:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Adverse events for BREATHE-EASY trial patients (completed study)
('cc0e8400-e29b-41d4-a716-446655440013', '990e8400-e29b-41d4-a716-446655440022', 'COPD exacerbation requiring hospitalization. Treated with standard therapy, patient recovered fully. Unrelated to study medication per investigator.', '2023-09-12', 'Severe', 'Resolved', false, '2023-09-12 22:15:00+00', '2023-09-20 14:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440014', '990e8400-e29b-41d4-a716-446655440023', 'Mild throat irritation reported after inhaler use. Symptoms resolved with technique adjustment and spacer device use.', '2023-08-05', 'Mild', 'Resolved', true, '2023-08-05 10:30:00+00', '2023-08-08 09:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440015', '990e8400-e29b-41d4-a716-446655440024', 'Pneumonia requiring antibiotic treatment. Patient hospitalized for 5 days, made full recovery. Determined unrelated to study drug.', '2023-11-22', 'Severe', 'Resolved', false, '2023-11-22 16:45:00+00', '2023-12-02 11:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440016', '990e8400-e29b-41d4-a716-446655440025', 'Increased cough and sputum production noted in week 2. Led to patient withdrawal from study. Assessed as possibly related to study medication.', '2023-07-15', 'Moderate', 'Ongoing', true, '2023-07-15 14:20:00+00', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc0e8400-e29b-41d4-a716-446655440017', '990e8400-e29b-41d4-a716-446655440026', 'Oral thrush secondary to inhaled corticosteroid component. Treated with antifungal therapy, resolved completely within 10 days.', '2023-10-18', 'Mild', 'Resolved', true, '2023-10-18 11:15:00+00', '2023-10-28 10:00:00+00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;
