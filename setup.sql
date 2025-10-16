-- Quality Assurance Tool Database Setup
-- Copy and paste these commands into your Supabase SQL Editor

-- 1. Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku VARCHAR(100) NOT NULL UNIQUE,
  serial_number VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create product_photos table
CREATE TABLE IF NOT EXISTS product_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_name VARCHAR(255) NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_serial_number ON products(serial_number);
CREATE INDEX IF NOT EXISTS idx_product_photos_product_id ON product_photos(product_id);

-- 4. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_photos ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies (allow all operations for now)
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
DROP POLICY IF EXISTS "Allow all operations on product_photos" ON product_photos;

CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on product_photos" ON product_photos FOR ALL USING (true);

-- 6. Test the setup with a sample product
INSERT INTO products (sku, serial_number, name, description) 
VALUES ('TEST-001', 'SN-TEST-001', 'Test Product', 'This is a test product to verify the setup');

-- 7. Clean up test data
DELETE FROM products WHERE sku = 'TEST-001';
