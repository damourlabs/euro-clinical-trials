-- Seed file for audit logs
-- This file creates sample audit log entries for development and testing

INSERT INTO audit_logs (
    uuid,
    trial_uuid,
    user_uuid,
    audit_action,
    audit_entity_type,
    entity_uuid,
    changes,
    timestamp,
    ip_address,
    user_agent,
    session_id
) VALUES 
-- User management audit entries
('dd0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440018', 'Create', 'Trial', '770e8400-e29b-41d4-a716-446655440001', '{"title": "CARDIO-PROTECT: Novel ACE Inhibitor in Heart Failure", "status": "Active", "phase": "III"}', '2025-01-15 09:30:00+00', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Create', 'Patient', '990e8400-e29b-41d4-a716-446655440001', '{"subject_id": "CARDIO-001-001", "status": "Active", "enrollment_date": "2025-01-20"}', '2025-01-20 14:15:00+00', '10.0.0.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440002'),
('dd0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'Update', 'Patient', '990e8400-e29b-41d4-a716-446655440001', '{"randomization_group": {"old": "NotAssigned", "new": "Treatment"}}', '2025-01-21 10:45:00+00', '10.0.0.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440003'),
('dd0e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', 'View', 'Patient', '990e8400-e29b-41d4-a716-446655440001', '{"accessed_sections": ["demographics", "medical_history", "randomization"]}', '2025-01-22 16:20:00+00', '172.16.0.25', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440004'),

-- Adverse event reporting audit entries
('dd0e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440015', 'Create', 'AdverseEvent', 'cc0e8400-e29b-41d4-a716-446655440001', '{"description": "Mild dizziness", "severity": "Mild", "related_to_trial": true}', '2025-02-15 14:35:00+00', '10.0.0.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440005'),
('dd0e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Update', 'AdverseEvent', 'cc0e8400-e29b-41d4-a716-446655440001', '{"outcome": {"old": "Ongoing", "new": "Resolved"}, "resolved_at": "2025-02-15 18:30:00"}', '2025-02-15 18:35:00+00', '10.0.0.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440006'),

-- GDPR consent audit entries
('dd0e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'Create', 'GDPRConsent', 'bb0e8400-e29b-41d4-a716-446655440001', '{"consent_given": true, "consent_type": "Data_processing", "legal_basis": "Consent"}', '2025-01-20 14:20:00+00', '10.0.0.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440007'),
('dd0e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'Update', 'GDPRConsent', 'bb0e8400-e29b-41d4-a716-446655440005', '{"consent_status": {"old": "Consented", "new": "Withdrawn"}, "withdrawal_date": "2025-06-15", "withdrawal_method": "Patient_portal"}', '2025-06-15 11:30:00+00', '192.168.1.200', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440008'),

-- Trial management audit entries
('dd0e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Update', 'Trial', '770e8400-e29b-41d4-a716-446655440001', '{"current_enrollment": {"old": 320, "new": 342}}', '2025-07-15 13:45:00+00', '203.0.113.10', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '11110000-e29b-41d4-a716-446655440009'),
('dd0e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Create', 'Trial', '770e8400-e29b-41d4-a716-446655440002', '{"title": "ONCO-TARGET: Precision Medicine in Advanced NSCLC", "status": "Active", "phase": "II"}', '2024-09-01 08:00:00+00', '172.16.0.50', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0', '11110000-e29b-41d4-a716-446655440010'),

-- Site management audit entries
('dd0e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', 'View', 'Trial', '770e8400-e29b-41d4-a716-446655440001', '{"monitoring_visit": "routine_quarterly", "sites_reviewed": ["880e8400-e29b-41d4-a716-446655440001", "880e8400-e29b-41d4-a716-446655440002"]}', '2025-04-10 09:30:00+00', '172.16.0.25', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440011'),
('dd0e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'Update', 'Patient', '990e8400-e29b-41d4-a716-446655440006', '{"data_completeness": {"old": "89.20", "new": "96.80"}}', '2025-05-20 15:25:00+00', '192.168.100.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440012'),

-- Data management audit entries
('dd0e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'View', 'Trial', '770e8400-e29b-41d4-a716-446655440001', '{"data_export": "patient_demographics", "export_format": "CSV", "record_count": 295}', '2025-06-01 11:15:00+00', '10.1.1.50', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440013'),
('dd0e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', 'View', 'Trial', '770e8400-e29b-41d4-a716-446655440002', '{"data_export": "adverse_events", "export_format": "SAS", "record_count": 45}', '2025-03-15 14:45:00+00', '192.168.50.25', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440014'),

-- Statistical analysis audit entries
('dd0e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440013', 'View', 'Trial', '770e8400-e29b-41d4-a716-446655440005', '{"analysis_type": "interim_efficacy", "data_cutoff": "2024-12-31", "population": "ITT"}', '2025-01-10 16:30:00+00', '203.0.113.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440015'),

-- Regulatory audit entries
('dd0e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440014', 'View', 'Trial', '770e8400-e29b-41d4-a716-446655440001', '{"regulatory_submission": "DSUR_annual", "submission_date": "2025-01-15", "authority": "EMA"}', '2025-01-15 10:00:00+00', '172.16.10.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440016'),

-- Patient withdrawal audit entries
('dd0e8400-e29b-41d4-a716-446655440017', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'Update', 'Patient', '990e8400-e29b-41d4-a716-446655440005', '{"status": {"old": "Active", "new": "Withdrawn"}, "withdrawal_date": "2025-06-15", "withdrawal_reason": "Patient request"}', '2025-06-15 11:35:00+00', '192.168.1.200', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440017'),

-- System administration audit entries
('dd0e8400-e29b-41d4-a716-446655440018', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440018', 'Create', 'Trial', '770e8400-e29b-41d4-a716-446655440004', '{"title": "DIABETES-NEXT: Advanced Glucose Control Technology", "status": "Planning", "phase": "III"}', '2025-02-28 12:00:00+00', '10.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440018'),
('dd0e8400-e29b-41d4-a716-446655440019', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440018', 'Update', 'Trial', '770e8400-e29b-41d4-a716-446655440005', '{"status": {"old": "Active", "new": "Completed"}, "actual_end_date": "2025-01-31"}', '2025-01-31 17:00:00+00', '10.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440019'),

-- Multi-site coordination audit entries
('dd0e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'View', 'Trial', '770e8400-e29b-41d4-a716-446655440002', '{"cross_site_review": "enrollment_rates", "sites_compared": ["880e8400-e29b-41d4-a716-446655440004", "880e8400-e29b-41d4-a716-446655440005", "880e8400-e29b-41d4-a716-446655440006"]}', '2025-02-20 13:15:00+00', '172.16.0.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '11110000-e29b-41d4-a716-446655440020')

ON CONFLICT (uuid) DO NOTHING;
