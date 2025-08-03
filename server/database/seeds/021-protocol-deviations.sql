-- Seed file for protocol deviations
-- This file creates protocol deviation records

INSERT INTO protocol_deviations (
    uuid,
    trial_uuid,
    patient_uuid,
    site_uuid,
    description,
    date_occurred,
    severity,
    impact_assessment,
    corrective_action,
    reported_at
) VALUES 
-- Cardiovascular Trial Deviations
('860e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Visit window exceeded by 2 days due to patient scheduling conflict', '2024-02-14', 'Mild', 'Minimal impact on primary endpoint assessment. All required procedures completed within acceptable timeframe.', 'Site staff educated on visit window management. Patient rescheduling procedures revised.', '2024-02-15 14:30:00+00'),
('860e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'Laboratory sample collected 4 hours outside protocol specified timeframe', '2024-02-02', 'Mild', 'Sample integrity maintained. Results within expected range and clinically meaningful.', 'Laboratory collection procedures reviewed with site staff. Updated reminder system implemented.', '2024-02-02 16:45:00+00'),

-- Oncology Trial Deviations
('860e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', 'Concomitant medication not reported within 24 hours as required by protocol', '2024-02-05', 'Moderate', 'Delay in reporting could affect safety assessment. No drug interactions identified upon review.', 'Site training on concomitant medication reporting procedures conducted. Electronic reminder system activated.', '2024-02-07 11:20:00+00'),
('860e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', 'Pre-dose laboratory values not available prior to treatment administration', '2024-02-17', 'Moderate', 'Treatment administered without confirmation of safety parameters. Post-dose labs confirmed normal values.', 'Laboratory scheduling procedures revised. Pre-treatment checklist updated and mandatory completion implemented.', '2024-02-17 15:10:00+00'),

-- Neurological Trial Deviations
('860e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440003', 'Motor assessment performed by unqualified staff member', '2024-02-09', 'Severe', 'Assessment validity compromised. Primary endpoint data integrity affected for this visit.', 'Qualified staff member repeated assessment within 48 hours. Staff qualification verification process strengthened.', '2024-02-09 13:45:00+00'),

-- Diabetes Trial Deviations
('860e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440001', 'HbA1c sample not collected at baseline visit', '2024-02-05', 'Moderate', 'Missing critical baseline biomarker for efficacy assessment. Alternative assessment methods not available.', 'Sample collected at next visit. Baseline evaluation extended. Missing data procedures activated.', '2024-02-06 09:30:00+00'),
('860e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440002', 'Glucose monitoring device calibration expired', '2024-01-31', 'Mild', 'Glucose readings may have reduced accuracy. Clinical significance minimal given short duration.', 'Device recalibrated immediately. Calibration schedule updated and automated reminders implemented.', '2024-01-31 16:20:00+00'),

-- Respiratory Trial Deviations
('860e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440003', 'Spirometry test not completed within protocol timeframe', '2024-02-16', 'Moderate', 'Lung function assessment delayed. Patient remained stable. Subsequent test completed successfully.', 'Pulmonary function lab scheduling prioritized for trial patients. Backup testing facilities identified.', '2024-02-16 12:15:00+00')

ON CONFLICT (uuid) DO NOTHING;
