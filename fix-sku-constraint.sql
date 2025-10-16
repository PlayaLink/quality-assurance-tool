-- Fix SKU constraint to allow multiple products with same SKU
-- Keep serial number unique (each physical product has unique serial)

-- Remove the unique constraint from sku column
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_sku_key;

-- Remove any existing unique constraint on serial_number first
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_serial_number_key;

-- Add the unique constraint on serial_number (each physical product is unique)
ALTER TABLE products ADD CONSTRAINT products_serial_number_key UNIQUE (serial_number);

-- Update the index to be non-unique
DROP INDEX IF EXISTS idx_products_sku;
CREATE INDEX idx_products_sku ON products(sku);
