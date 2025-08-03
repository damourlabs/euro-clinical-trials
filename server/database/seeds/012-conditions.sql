-- Seed file for conditions
-- This file creates medical conditions used in eligibility criteria

INSERT INTO conditions (
    uuid,
    name,
    description,
    created_at
) VALUES 
-- Cardiovascular Conditions
('770e8400-e29b-41d4-a716-446655440001', 'Hypertension', 'High blood pressure condition requiring medical management', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440002', 'Coronary Artery Disease', 'Narrowing of coronary arteries affecting heart blood supply', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440003', 'Heart Failure', 'Reduced ability of heart to pump blood effectively', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440004', 'Atrial Fibrillation', 'Irregular heart rhythm affecting cardiac output', CURRENT_TIMESTAMP),

-- Oncological Conditions
('770e8400-e29b-41d4-a716-446655440005', 'Breast Cancer', 'Malignant tumor originating in breast tissue', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440006', 'Lung Cancer', 'Primary malignancy of lung tissue', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440007', 'Colorectal Cancer', 'Cancer affecting colon or rectum', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440008', 'Prostate Cancer', 'Malignancy of prostate gland in males', CURRENT_TIMESTAMP),

-- Neurological Conditions
('770e8400-e29b-41d4-a716-446655440009', 'Parkinson Disease', 'Progressive neurodegenerative disorder affecting movement', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440010', 'Alzheimer Disease', 'Progressive dementia affecting memory and cognition', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440011', 'Multiple Sclerosis', 'Autoimmune disease affecting central nervous system', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440012', 'Epilepsy', 'Neurological disorder characterized by recurrent seizures', CURRENT_TIMESTAMP),

-- Metabolic Conditions
('770e8400-e29b-41d4-a716-446655440013', 'Type 2 Diabetes', 'Metabolic disorder characterized by insulin resistance', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440014', 'Type 1 Diabetes', 'Autoimmune destruction of pancreatic beta cells', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440015', 'Obesity', 'Excessive body weight affecting health outcomes', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440016', 'Metabolic Syndrome', 'Cluster of conditions increasing cardiovascular risk', CURRENT_TIMESTAMP),

-- Respiratory Conditions
('770e8400-e29b-41d4-a716-446655440017', 'Asthma', 'Chronic inflammatory airway disease', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440018', 'COPD', 'Chronic obstructive pulmonary disease', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440019', 'Pulmonary Fibrosis', 'Progressive scarring of lung tissue', CURRENT_TIMESTAMP),

-- Immunological Conditions
('770e8400-e29b-41d4-a716-446655440020', 'Rheumatoid Arthritis', 'Autoimmune inflammatory joint disease', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440021', 'Systemic Lupus Erythematosus', 'Systemic autoimmune connective tissue disease', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440022', 'Crohn Disease', 'Inflammatory bowel disease affecting digestive tract', CURRENT_TIMESTAMP),

-- Psychological/Psychiatric Conditions
('770e8400-e29b-41d4-a716-446655440023', 'Major Depressive Disorder', 'Persistent mood disorder affecting daily functioning', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440024', 'Anxiety Disorder', 'Excessive worry and fear affecting quality of life', CURRENT_TIMESTAMP),
('770e8400-e29b-41d4-a716-446655440025', 'Bipolar Disorder', 'Mood disorder with alternating manic and depressive episodes', CURRENT_TIMESTAMP)

ON CONFLICT (name) DO NOTHING;
