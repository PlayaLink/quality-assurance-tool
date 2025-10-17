-- Create collections table for managing collection definitions
CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_collections_key ON collections(key);

-- Enable Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Create RLS policy (allow all operations for now)
DROP POLICY IF EXISTS "Allow all operations on collections" ON collections;
CREATE POLICY "Allow all operations on collections" ON collections FOR ALL USING (true);

-- Insert collection data
INSERT INTO collections (key, name) VALUES 
  ('porta_rectangular_dining_table', 'Porta Rectangular Dining Table'),
  ('porta_round_dining_table', 'Porta Round Dining Table'),
  ('leon_stone_rectangular_dining_table', 'Leon Stone Rectangular Dining Table'),
  ('leon_stone_round_dining_table', 'Leon Stone Round Dining Table'),
  ('cellini_outdoor_round_dining_table', 'Cellini Outdoor Round Dining Table'),
  ('aero_stone_outdoor_rectangular_dining_table', 'Aero Stone Outdoor Rectangular Dining Table'),
  ('aero_stone_outdoor_oval_dining_table', 'Aero Stone Outdoor Oval Dining Table'),
  ('aero_stone_outdoor_round_dining_table', 'Aero Stone Outdoor Round Dining Table'),
  ('terzo_oval_bowl_dining_table', 'Terzo Oval Bowl Dining Table'),
  ('terzo_rectangular_cylinder_dining_table', 'Terzo Rectangular Cylinder Dining Table'),
  ('terzo_rectangular_bowl_dining_table', 'Terzo Rectangular Bowl Dining Table'),
  ('terzo_round_dining_table', 'Terzo Round Dining Table'),
  ('terzo_round_bowl_dining_table', 'Terzo Round Bowl Dining Table'),
  ('terzo_round_tapered_dining_table', 'Terzo Round Tapered Dining Table'),
  ('cabrera_outdoor_round_dining_table', 'Cabrera Outdoor Round Dining Table'),
  ('caprera_concrete_rectangular_dining_table', 'Caprera Concrete Rectangular Dining Table'),
  ('belgian_trestle_concrete_teak_rectangular_dining_table', 'Belgian Trestle Concrete & Teak Rectangular Dining Table'),
  ('belgian_trestle_concrete_teak_round_dining_table', 'Belgian Trestle Concrete & Teak Round Dining Table'),
  ('french_beam_concrete_teak_rectangular_dining_table', 'French Beam Concrete & Teak Rectangular Dining Table'),
  ('french_beam_concrete_teak_round_dining_table', 'French Beam Concrete & Teak Round Dining Table'),
  ('porta_oval_coffee_table', 'Porta Oval Coffee Table'),
  ('porta_round_coffee_table', 'Porta Round Coffee Table'),
  ('leon_stone_coffee_table', 'Leon Stone Coffee Table'),
  ('leon_stone_round_coffee_table', 'Leon Stone Round Coffee Table'),
  ('leon_stone_nesting_coffee_table', 'Leon Stone Nesting Coffee Table'),
  ('caprera_concrete_round_coffee_table', 'Caprera Concrete Round Coffee Table'),
  ('terzo_oval_bowl_coffee_table', 'Terzo Oval Bowl Coffee Table'),
  ('terzo_round_coffee_table', 'Terzo Round Coffee Table'),
  ('terzo_round_bowl_coffee_table', 'Terzo Round Bowl Coffee Table'),
  ('terzo_round_tapered_coffee_table', 'Terzo Round Tapered Coffee Table')
ON CONFLICT (key) DO NOTHING;

-- Verify the data was inserted
SELECT COUNT(*) as total_collections FROM collections;
SELECT key, name FROM collections ORDER BY name;
