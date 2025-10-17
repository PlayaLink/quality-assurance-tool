-- Update products table schema to match new Product type
-- Remove serial_number column and add collection, length, width columns

-- Step 1: Remove the unique constraint on serial_number (if it exists)
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_serial_number_key;

-- Step 2: Drop the serial_number column
ALTER TABLE products DROP COLUMN IF EXISTS serial_number;

-- Step 3: Add new columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS collection VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS length DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS width DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Step 4: Update existing records with default values (if any exist)
-- You may want to customize these default values based on your data
UPDATE products SET 
  collection = 'Default Collection',
  length = 0,
  width = 0
WHERE collection = '' OR collection IS NULL;

-- Step 5: Add constraints for the new columns
ALTER TABLE products ALTER COLUMN collection SET NOT NULL;
ALTER TABLE products ALTER COLUMN length SET NOT NULL;
ALTER TABLE products ALTER COLUMN width SET NOT NULL;

-- Step 6: Add check constraints to ensure positive dimensions
ALTER TABLE products ADD CONSTRAINT check_length_positive CHECK (length >= 0);
ALTER TABLE products ADD CONSTRAINT check_width_positive CHECK (width >= 0);

-- Step 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);
CREATE INDEX IF NOT EXISTS idx_products_dimensions ON products(length, width);

-- Step 8: Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
