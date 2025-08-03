-- Seed file for clinical trial sites
-- This file creates sample research sites for development and testing

INSERT INTO sites (
    uuid,
    trial_uuid,
    name,
    address,
    contact_person_uuid,
    principal_investigator_uuid,
    study_coordinator_uuid,
    facility_type,
    site_status,
    patients_enrolled,
    target_enrollment,
    data_submission_status,
    activation_date,
    data_completeness,
    protocol_deviations,
    adverse_events_reported,
    created_at,
    updated_at
) VALUES 
-- Sites for CARDIO-PROTECT Trial
('880e8400-e29b-41d4-a716-446655440001',
 '770e8400-e29b-41d4-a716-446655440001', -- CARDIO-PROTECT trial
 'University Medical Center Amsterdam - Cardiology',
 'Meibergdreef 9, 1105 AZ Amsterdam, Netherlands',
 '550e8400-e29b-41d4-a716-446655440006', -- Sarah Collins (contact)
 '550e8400-e29b-41d4-a716-446655440003', -- Dr. Elena Rossi (PI)
 '550e8400-e29b-41d4-a716-446655440006', -- Sarah Collins (coordinator)
 'Hospital',
 'Active',
 85,
 120,
 'OnTime',
 '2025-01-15',
 '94.50',
 2,
 7,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

('880e8400-e29b-41d4-a716-446655440002',
 '770e8400-e29b-41d4-a716-446655440001', -- CARDIO-PROTECT trial
 'Charité - Universitätsmedizin Berlin',
 'Charitéplatz 1, 10117 Berlin, Germany',
 '550e8400-e29b-41d4-a716-446655440007', -- Thomas Weber (contact)
 '550e8400-e29b-41d4-a716-446655440004', -- Prof. Hans Mueller (PI)
 '550e8400-e29b-41d4-a716-446655440007', -- Thomas Weber (coordinator)
 'Hospital',
 'Active',
 112,
 150,
 'OnTime',
 '2025-01-15',
 '96.20',
 1,
 5,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

('880e8400-e29b-41d4-a716-446655440003',
 '770e8400-e29b-41d4-a716-446655440001', -- CARDIO-PROTECT trial
 'Assistance Publique - Hôpitaux de Paris',
 '1 Place du Parvis Notre-Dame, 75004 Paris, France',
 '550e8400-e29b-41d4-a716-446655440008', -- Isabelle Martin (contact)
 '550e8400-e29b-41d4-a716-446655440005', -- Dr. Marie Dubois (PI)
 '550e8400-e29b-41d4-a716-446655440008', -- Isabelle Martin (coordinator)
 'Hospital',
 'Active',
 98,
 130,
 'Delayed',
 '2025-01-20',
 '89.30',
 3,
 9,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

-- Sites for ONCO-TARGET Trial
('880e8400-e29b-41d4-a716-446655440004',
 '770e8400-e29b-41d4-a716-446655440002', -- ONCO-TARGET trial
 'Charité Cancer Center Berlin',
 'Augustenburger Platz 1, 13353 Berlin, Germany',
 '550e8400-e29b-41d4-a716-446655440007', -- Thomas Weber (contact)
 '550e8400-e29b-41d4-a716-446655440004', -- Prof. Hans Mueller (PI)
 '550e8400-e29b-41d4-a716-446655440007', -- Thomas Weber (coordinator)
 'ResearchCenter',
 'Active',
 45,
 80,
 'OnTime',
 '2024-09-01',
 '92.80',
 0,
 12,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

('880e8400-e29b-41d4-a716-446655440005',
 '770e8400-e29b-41d4-a716-446655440002', -- ONCO-TARGET trial
 'Netherlands Cancer Institute',
 'Plesmanlaan 121, 1066 CX Amsterdam, Netherlands',
 '550e8400-e29b-41d4-a716-446655440006', -- Sarah Collins (contact)
 '550e8400-e29b-41d4-a716-446655440003', -- Dr. Elena Rossi (PI)
 '550e8400-e29b-41d4-a716-446655440006', -- Sarah Collins (coordinator)
 'ResearchCenter',
 'Active',
 52,
 90,
 'OnTime',
 '2024-09-15',
 '95.10',
 1,
 8,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

('880e8400-e29b-41d4-a716-446655440006',
 '770e8400-e29b-41d4-a716-446655440002', -- ONCO-TARGET trial
 'Institut Gustave Roussy',
 '114 Rue Edouard Vaillant, 94805 Villejuif, France',
 '550e8400-e29b-41d4-a716-446655440008', -- Isabelle Martin (contact)
 '550e8400-e29b-41d4-a716-446655440005', -- Dr. Marie Dubois (PI)
 '550e8400-e29b-41d4-a716-446655440008', -- Isabelle Martin (coordinator)
 'ResearchCenter',
 'Active',
 30,
 70,
 'Delayed',
 '2024-10-01',
 '87.60',
 2,
 6,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

-- Sites for NEURO-SHIELD Trial
('880e8400-e29b-41d4-a716-446655440007',
 '770e8400-e29b-41d4-a716-446655440003', -- NEURO-SHIELD trial
 'Salpêtrière Hospital - Neurology Department',
 '47-83 Boulevard de l Hôpital, 75013 Paris, France',
 '550e8400-e29b-41d4-a716-446655440008', -- Isabelle Martin (contact)
 '550e8400-e29b-41d4-a716-446655440005', -- Dr. Marie Dubois (PI)
 '550e8400-e29b-41d4-a716-446655440008', -- Isabelle Martin (coordinator)
 'Hospital',
 'Active',
 25,
 60,
 'OnTime',
 '2024-11-01',
 '91.20',
 1,
 3,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

('880e8400-e29b-41d4-a716-446655440008',
 '770e8400-e29b-41d4-a716-446655440003', -- NEURO-SHIELD trial
 'VU Medical Center - Neurology',
 'De Boelelaan 1117, 1081 HV Amsterdam, Netherlands',
 '550e8400-e29b-41d4-a716-446655440006', -- Sarah Collins (contact)
 '550e8400-e29b-41d4-a716-446655440003', -- Dr. Elena Rossi (PI)
 '550e8400-e29b-41d4-a716-446655440006', -- Sarah Collins (coordinator)
 'Hospital',
 'Active',
 34,
 80,
 'OnTime',
 '2024-11-15',
 '93.40',
 0,
 2,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

-- Sites for DIABETES-NEXT Trial (Planning phase)
('880e8400-e29b-41d4-a716-446655440009',
 '770e8400-e29b-41d4-a716-446655440004', -- DIABETES-NEXT trial
 'Diabeter - Center for Pediatric and Adolescent Diabetes Care',
 'Koningin Julianaplein 10, 3037 EE Rotterdam, Netherlands',
 '550e8400-e29b-41d4-a716-446655440006', -- Sarah Collins (contact)
 '550e8400-e29b-41d4-a716-446655440003', -- Dr. Elena Rossi (PI)
 '550e8400-e29b-41d4-a716-446655440006', -- Sarah Collins (coordinator)
 'Clinic',
 'Pending',
 0,
 100,
 'NotSubmitted',
 '2025-03-01',
 '0.00',
 0,
 0,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP),

-- Sites for BREATHE-EASY Trial (Completed)
('880e8400-e29b-41d4-a716-446655440010',
 '770e8400-e29b-41d4-a716-446655440005', -- BREATHE-EASY trial
 'Berlin Institute for Respiratory Medicine',
 'Lindenberger Weg 80, 13125 Berlin, Germany',
 '550e8400-e29b-41d4-a716-446655440007', -- Thomas Weber (contact)
 '550e8400-e29b-41d4-a716-446655440004', -- Prof. Hans Mueller (PI)
 '550e8400-e29b-41d4-a716-446655440007', -- Thomas Weber (coordinator)
 'ResearchCenter',
 'Closed',
 200,
 200,
 'OnTime',
 '2023-06-01',
 '98.50',
 5,
 18,
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;