-- Create skus table for managing SKU definitions
CREATE TABLE IF NOT EXISTS skus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_skus_key ON skus(key);

-- Enable Row Level Security
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;

-- Create RLS policy (allow all operations for now)
DROP POLICY IF EXISTS "Allow all operations on skus" ON skus;
CREATE POLICY "Allow all operations on skus" ON skus FOR ALL USING (true);

-- Insert some sample SKUs for testing
INSERT INTO skus (key, display_name) VALUES 
  ('CHAIR-001', 'Executive Office Chair'),
  ('DESK-001', 'Standing Desk Pro'),
  ('TABLE-001', 'Conference Table Large'),
  ('SHELF-001', 'Bookcase 5-Shelf'),
  ('LAMP-001', 'Desk Lamp LED')
ON CONFLICT (key) DO NOTHING;
