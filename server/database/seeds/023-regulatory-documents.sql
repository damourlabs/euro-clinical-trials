-- Seed file for regulatory documents
-- This file links documents to regulatory approvals

INSERT INTO regulatory_documents (
    uuid,
    regulatory_approval_uuid,
    document_uuid
) VALUES 
-- EMA Cardiovascular Trial Documents
('880e8400-e29b-41d4-a716-446655440001', '870e8400-e29b-41d4-a716-446655440001', 'ee0e8400-e29b-41d4-a716-446655440001'), -- Protocol
('880e8400-e29b-41d4-a716-446655440002', '870e8400-e29b-41d4-a716-446655440001', 'ee0e8400-e29b-41d4-a716-446655440002'), -- Consent Form

-- Netherlands Cardiovascular Trial Documents
('880e8400-e29b-41d4-a716-446655440003', '870e8400-e29b-41d4-a716-446655440002', 'ee0e8400-e29b-41d4-a716-446655440001'), -- Protocol
('880e8400-e29b-41d4-a716-446655440004', '870e8400-e29b-41d4-a716-446655440002', 'ee0e8400-e29b-41d4-a716-446655440003'), -- EMA Authorization

-- German Cardiovascular Trial Documents
('880e8400-e29b-41d4-a716-446655440005', '870e8400-e29b-41d4-a716-446655440003', 'ee0e8400-e29b-41d4-a716-446655440001'), -- Protocol
('880e8400-e29b-41d4-a716-446655440006', '870e8400-e29b-41d4-a716-446655440003', 'ee0e8400-e29b-41d4-a716-446655440022'), -- German Consent Form

-- EMA Oncology Trial Documents  
('880e8400-e29b-41d4-a716-446655440007', '870e8400-e29b-41d4-a716-446655440004', 'ee0e8400-e29b-41d4-a716-446655440005'), -- Oncology Protocol
('880e8400-e29b-41d4-a716-446655440008', '870e8400-e29b-41d4-a716-446655440004', 'ee0e8400-e29b-41d4-a716-446655440006'), -- Biomarker Plan

-- German Oncology Trial Documents
('880e8400-e29b-41d4-a716-446655440009', '870e8400-e29b-41d4-a716-446655440005', 'ee0e8400-e29b-41d4-a716-446655440005'), -- Oncology Protocol
('880e8400-e29b-41d4-a716-446655440010', '870e8400-e29b-41d4-a716-446655440005', 'ee0e8400-e29b-41d4-a716-446655440007'), -- German Patient Info Sheet

-- French Oncology Trial Documents
('880e8400-e29b-41d4-a716-446655440011', '870e8400-e29b-41d4-a716-446655440006', 'ee0e8400-e29b-41d4-a716-446655440005'), -- Oncology Protocol
('880e8400-e29b-41d4-a716-446655440012', '870e8400-e29b-41d4-a716-446655440006', 'ee0e8400-e29b-41d4-a716-446655440025'), -- French ANSM Approval

-- EMA Neurological Trial Documents
('880e8400-e29b-41d4-a716-446655440013', '870e8400-e29b-41d4-a716-446655440007', 'ee0e8400-e29b-41d4-a716-446655440008'), -- Neurological Study Manual
('880e8400-e29b-41d4-a716-446655440014', '870e8400-e29b-41d4-a716-446655440007', 'ee0e8400-e29b-41d4-a716-446655440009'), -- Cognitive Assessment Manual

-- French Neurological Trial Documents
('880e8400-e29b-41d4-a716-446655440015', '870e8400-e29b-41d4-a716-446655440008', 'ee0e8400-e29b-41d4-a716-446655440008'), -- Neurological Study Manual
('880e8400-e29b-41d4-a716-446655440016', '870e8400-e29b-41d4-a716-446655440008', 'ee0e8400-e29b-41d4-a716-446655440010'), -- French Ethics Approval

-- EMA Diabetes Trial Documents
('880e8400-e29b-41d4-a716-446655440017', '870e8400-e29b-41d4-a716-446655440009', 'ee0e8400-e29b-41d4-a716-446655440011'), -- Diabetes Protocol Draft

-- Netherlands Diabetes Trial Documents
('880e8400-e29b-41d4-a716-446655440018', '870e8400-e29b-41d4-a716-446655440010', 'ee0e8400-e29b-41d4-a716-446655440011'), -- Diabetes Protocol Draft

-- German Diabetes Trial Documents
('880e8400-e29b-41d4-a716-446655440019', '870e8400-e29b-41d4-a716-446655440011', 'ee0e8400-e29b-41d4-a716-446655440011'), -- Diabetes Protocol Draft

-- EMA Respiratory Trial Documents
('880e8400-e29b-41d4-a716-446655440020', '870e8400-e29b-41d4-a716-446655440012', 'ee0e8400-e29b-41d4-a716-446655440013'), -- Final Study Report

-- German Respiratory Trial Documents
('880e8400-e29b-41d4-a716-446655440021', '870e8400-e29b-41d4-a716-446655440013', 'ee0e8400-e29b-41d4-a716-446655440013') -- Final Study Report

ON CONFLICT (regulatory_approval_uuid, document_uuid) DO NOTHING;
