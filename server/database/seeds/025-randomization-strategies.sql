

-- Seed file for randomization strategies
-- This file creates randomization strategies for study designs

INSERT INTO randomization_strategies (
    uuid,
    randomization_strategy,
    allocation_ratio,
    block_size,
    created_at
) VALUES 
-- Simple randomization strategies
('900e8400-e29b-41d4-a716-446655440001', 'Simple', '1:1', NULL, CURRENT_TIMESTAMP),
('900e8400-e29b-41d4-a716-446655440002', 'Simple', '2:1', NULL, CURRENT_TIMESTAMP),

-- Block randomization strategies
('900e8400-e29b-41d4-a716-446655440003', 'Block', '1:1', 4, CURRENT_TIMESTAMP),
('900e8400-e29b-41d4-a716-446655440004', 'Block', '1:1', 6, CURRENT_TIMESTAMP),
('900e8400-e29b-41d4-a716-446655440005', 'Block', '2:1', 6, CURRENT_TIMESTAMP),

-- Stratified randomization strategies
('900e8400-e29b-41d4-a716-446655440006', 'Stratified', '1:1', 4, CURRENT_TIMESTAMP),
('900e8400-e29b-41d4-a716-446655440007', 'Stratified', '1:1', 8, CURRENT_TIMESTAMP),

-- Adaptive randomization strategies
('900e8400-e29b-41d4-a716-446655440008', 'Adaptive', '1:1', NULL, CURRENT_TIMESTAMP),
('900e8400-e29b-41d4-a716-446655440009', 'Adaptive', '2:1', NULL, CURRENT_TIMESTAMP)

ON CONFLICT (uuid) DO NOTHING;
