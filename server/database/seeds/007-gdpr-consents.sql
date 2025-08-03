-- Seed file for GDPR consents
-- This file creates GDPR consent records for patients

INSERT INTO gdpr_consents (
    uuid,
    trial_uuid,
    patient_uuid,
    consent_given,
    consent_date,
    legal_basis,
    purpose,
    retention_period,
    data_processing_details,
    consent_status,
    consent_type,
    withdrawal_date,
    withdrawal_method,
    withdrawal_reason,
    user_agent,
    created_at,
    updated_at
) VALUES 
-- GDPR consents for CARDIO-PROTECT patients
('bb0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', true, '2025-01-20', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for cardiovascular trial management, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', true, '2025-01-22', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for cardiovascular trial management, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440003', true, '2025-01-25', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for cardiovascular trial management, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440004', true, '2025-01-28', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for cardiovascular trial management, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440005', false, '2025-02-01', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for cardiovascular trial management, safety monitoring, and regulatory compliance in accordance with GDPR', 'Withdrawn', 'Data_processing', '2025-06-15', 'Patient_portal', 'Personal', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- GDPR consents for more CARDIO-PROTECT patients at Charité
('bb0e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440006', true, '2025-01-25', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for cardiovascular trial management, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (Windows NT 10.0\; Win64; x64) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440007', true, '2025-01-30', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for cardiovascular trial management, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440008', true, '2025-02-05', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for cardiovascular trial management, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- GDPR consents for ONCO-TARGET patients
('bb0e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440010', true, '2024-09-15', 'Consent', 'Clinical_trial_management', 10, 'Data will be processed for oncology trial management including biomarker analysis, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440011', true, '2024-09-20', 'Consent', 'Clinical_trial_management', 10, 'Data will be processed for oncology trial management including biomarker analysis, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440012', true, '2024-09-25', 'Consent', 'Clinical_trial_management', 10, 'Data will be processed for oncology trial management including biomarker analysis, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440013', true, '2024-10-01', 'Consent', 'Clinical_trial_management', 10, 'Data will be processed for oncology trial management including biomarker analysis, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- GDPR consents for NEURO-SHIELD patients
('bb0e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440017', true, '2024-11-15', 'Consent', 'Clinical_trial_management', 15, 'Data will be processed for neurological trial management, cognitive assessments, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440018', true, '2024-11-20', 'Consent', 'Clinical_trial_management', 15, 'Data will be processed for neurological trial management, cognitive assessments, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440019', true, '2024-12-01', 'Consent', 'Clinical_trial_management', 15, 'Data will be processed for neurological trial management, cognitive assessments, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- GDPR consents for BREATHE-EASY patients (completed study)
('bb0e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440022', true, '2023-06-15', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for respiratory trial management, pulmonary function assessments, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440017', '770e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440023', true, '2023-06-20', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for respiratory trial management, pulmonary function assessments, safety monitoring, and regulatory compliance in accordance with GDPR', 'Consented', 'Data_processing', null, 'Patient_portal', 'Personal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bb0e8400-e29b-41d4-a716-446655440018', '770e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440024', false, '2023-07-01', 'Consent', 'Clinical_trial_management', 7, 'Data will be processed for respiratory trial management, pulmonary function assessments, safety monitoring, and regulatory compliance in accordance with GDPR', 'Withdrawn', 'Data_processing', '2023-12-15', 'Phone', 'Personal', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;

-- Insert data categories for GDPR consents
INSERT INTO gdpr_data_categories (
    consent_uuid,
    category
) VALUES
-- Categories for CARDIO-PROTECT patients (Health_data and Demographic_data)
('bb0e8400-e29b-41d4-a716-446655440001', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440001', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440003', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440003', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440004', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440004', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440005', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440005', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440006', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440006', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440007', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440007', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440008', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440008', 'Demographic_data'),

-- Categories for ONCO-TARGET patients (Health_data, Genetic_data, and Demographic_data)
('bb0e8400-e29b-41d4-a716-446655440009', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440009', 'Genetic_data'),
('bb0e8400-e29b-41d4-a716-446655440009', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440010', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440010', 'Genetic_data'),
('bb0e8400-e29b-41d4-a716-446655440010', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440011', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440011', 'Genetic_data'),
('bb0e8400-e29b-41d4-a716-446655440011', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440012', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440012', 'Genetic_data'),
('bb0e8400-e29b-41d4-a716-446655440012', 'Demographic_data'),

-- Categories for NEURO-SHIELD patients (Health_data and Demographic_data)
('bb0e8400-e29b-41d4-a716-446655440013', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440013', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440014', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440014', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440015', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440015', 'Demographic_data'),

-- Categories for BREATHE-EASY patients (Health_data and Demographic_data)
('bb0e8400-e29b-41d4-a716-446655440016', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440016', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440017', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440017', 'Demographic_data'),
('bb0e8400-e29b-41d4-a716-446655440018', 'Health_data'),
('bb0e8400-e29b-41d4-a716-446655440018', 'Demographic_data')

ON CONFLICT (consent_uuid, category) DO NOTHING;
