-- Seed file for initial users
-- This file creates sample users for development and testing

-- Insert demo users with proper GDPR compliance
INSERT INTO users (
    uuid,
    email,
    name,
    phone_number,
    institution,
    role,
    is_active,
    email_verified,
    gdpr_consent_given,
    gdpr_consent_date,
    created_at,
    updated_at
) VALUES 
-- Sponsors
('550e8400-e29b-41d4-a716-446655440001', 'anna.johnson@europharmacorp.com', 'Dr. Anna Johnson', '+31-20-1234567', 'EuroPharmaCorp', 'Sponsor', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440002', 'marcus.schmidt@biothera.de', 'Prof. Marcus Schmidt', '+49-30-2345678', 'BioThera Research GmbH', 'Sponsor', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Principal Investigators
('550e8400-e29b-41d4-a716-446655440003', 'elena.rossi@umcamsterdam.nl', 'Dr. Elena Rossi', '+31-20-5669111', 'University Medical Center Amsterdam', 'Investigator', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440004', 'hans.mueller@charite.de', 'Prof. Hans Mueller', '+49-30-45050', 'Charité - Universitätsmedizin Berlin', 'Investigator', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440005', 'marie.dubois@aphp.fr', 'Dr. Marie Dubois', '+33-1-42161000', 'Assistance Publique - Hôpitaux de Paris', 'Investigator', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Study Coordinators
('550e8400-e29b-41d4-a716-446655440006', 'sarah.collins@umcamsterdam.nl', 'Sarah Collins', '+31-20-5669112', 'University Medical Center Amsterdam', 'Coordinator', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440007', 'thomas.weber@charite.de', 'Thomas Weber', '+49-30-45051', 'Charité - Universitätsmedizin Berlin', 'Coordinator', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440008', 'isabelle.martin@aphp.fr', 'Isabelle Martin', '+33-1-42161001', 'Assistance Publique - Hôpitaux de Paris', 'Coordinator', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Clinical Research Monitors
('550e8400-e29b-41d4-a716-446655440009', 'james.wilson@europharmacorp.com', 'James Wilson', '+31-20-1234568', 'EuroPharmaCorp', 'Monitor', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440010', 'petra.hoffman@biothera.de', 'Petra Hoffman', '+49-30-2345679', 'BioThera Research GmbH', 'Monitor', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Data Managers
('550e8400-e29b-41d4-a716-446655440011', 'lisa.anderson@europharmacorp.com', 'Lisa Anderson', '+31-20-1234569', 'EuroPharmaCorp', 'DataManager', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440012', 'robert.brown@biothera.de', 'Robert Brown', '+49-30-2345680', 'BioThera Research GmbH', 'DataManager', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Statisticians
('550e8400-e29b-41d4-a716-446655440013', 'catherine.lopez@statconsult.es', 'Dr. Catherine Lopez', '+34-91-1234567', 'Statistical Consulting Services', 'Statistician', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Regulatory Affairs
('550e8400-e29b-41d4-a716-446655440014', 'michael.davis@europharmacorp.com', 'Michael Davis', '+31-20-1234570', 'EuroPharmaCorp', 'Regulatory', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Nurses
('550e8400-e29b-41d4-a716-446655440015', 'emma.thompson@umcamsterdam.nl', 'Emma Thompson', '+31-20-5669113', 'University Medical Center Amsterdam', 'Nurse', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440016', 'anna.schmidt@charite.de', 'Anna Schmidt', '+49-30-45052', 'Charité - Universitätsmedizin Berlin', 'Nurse', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440017', 'claire.bernard@aphp.fr', 'Claire Bernard', '+33-1-42161002', 'Assistance Publique - Hôpitaux de Paris', 'Nurse', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Admin Users
('550e8400-e29b-41d4-a716-446655440018', 'admin@euroclinicaltrials.eu', 'System Administrator', '+31-20-0000000', 'EuroClinicalTrials Platform', 'Admin', true, true, true, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT (email) DO NOTHING;
