-- Seed file for regulatory approvals
-- This file creates regulatory approval records for trials

INSERT INTO regulatory_approvals (
    uuid,
    trial_uuid,
    "approvalType",
    status,
    authority,
    approval_date,
    expiry_date,
    created_at
) VALUES 
-- Cardiovascular Trial Regulatory Approvals
('870e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'ClinicalTrial', 'Approved', 'European Medicines Agency (EMA)', '2023-12-15', '2025-12-15', CURRENT_TIMESTAMP),
('870e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'ClinicalTrial', 'Approved', 'Netherlands Medicines Evaluation Board (CBG-MEB)', '2023-12-20', '2025-12-20', CURRENT_TIMESTAMP),
('870e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'ClinicalTrial', 'Approved', 'German Federal Institute for Drugs and Medical Devices (BfArM)', '2023-12-22', '2025-12-22', CURRENT_TIMESTAMP),

-- Oncology Trial Regulatory Approvals
('870e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', 'ClinicalTrial', 'Approved', 'European Medicines Agency (EMA)', '2023-11-28', '2025-11-28', CURRENT_TIMESTAMP),
('870e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'ClinicalTrial', 'Approved', 'German Federal Institute for Drugs and Medical Devices (BfArM)', '2023-12-05', '2025-12-05', CURRENT_TIMESTAMP),
('870e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 'ClinicalTrial', 'Approved', 'French National Agency for the Safety of Medicine (ANSM)', '2023-12-08', '2025-12-08', CURRENT_TIMESTAMP),

-- Neurological Trial Regulatory Approvals
('870e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440003', 'ClinicalTrial', 'Approved', 'European Medicines Agency (EMA)', '2024-01-10', '2026-01-10', CURRENT_TIMESTAMP),
('870e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', 'ClinicalTrial', 'Approved', 'French National Agency for the Safety of Medicine (ANSM)', '2024-01-15', '2026-01-15', CURRENT_TIMESTAMP),

-- Diabetes Trial Regulatory Approvals
('870e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440004', 'ClinicalTrial', 'Approved', 'European Medicines Agency (EMA)', '2023-12-01', '2025-12-01', CURRENT_TIMESTAMP),
('870e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440004', 'ClinicalTrial', 'Approved', 'Netherlands Medicines Evaluation Board (CBG-MEB)', '2023-12-08', '2025-12-08', CURRENT_TIMESTAMP),
('870e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440004', 'ClinicalTrial', 'Approved', 'German Federal Institute for Drugs and Medical Devices (BfArM)', '2023-12-12', '2025-12-12', CURRENT_TIMESTAMP),

-- Respiratory Trial Regulatory Approvals
('870e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440005', 'ClinicalTrial', 'Approved', 'European Medicines Agency (EMA)', '2024-01-20', '2026-01-20', CURRENT_TIMESTAMP),
('870e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440005', 'ClinicalTrial', 'Approved', 'German Federal Institute for Drugs and Medical Devices (BfArM)', '2024-01-25', '2026-01-25', CURRENT_TIMESTAMP),

-- Device Approval Examples
('870e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440001', 'DeviceApproval', 'Approved', 'Notified Body CE Marking Authority', '2023-11-30', '2026-11-30', CURRENT_TIMESTAMP),
('870e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440003', 'DeviceApproval', 'Approved', 'Notified Body CE Marking Authority', '2023-12-28', '2026-12-28', CURRENT_TIMESTAMP),

-- Marketing Authorization Examples (for completed studies)
('870e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440002', 'MarketingAuthorization', 'Pending', 'European Medicines Agency (EMA)', NULL, NULL, CURRENT_TIMESTAMP),
('870e8400-e29b-41d4-a716-446655440017', '770e8400-e29b-41d4-a716-446655440004', 'MarketingAuthorization', 'Pending', 'European Medicines Agency (EMA)', NULL, NULL, CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;
