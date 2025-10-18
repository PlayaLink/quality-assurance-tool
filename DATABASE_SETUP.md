# Database Setup Guide

## Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `zchzagodrwjlgqvcqvqz`

## Step 2: Run SQL Commands

Go to **SQL Editor** in your Supabase dashboard and run the following commands:

### 1. Create Products Table

```sql
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku VARCHAR(100) NOT NULL UNIQUE,
  serial_number VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Create Product Photos Table

```sql
CREATE TABLE IF NOT EXISTS product_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_name VARCHAR(255) NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Create Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_serial_number ON products(serial_number);
CREATE INDEX IF NOT EXISTS idx_product_photos_product_id ON product_photos(product_id);
```

### 4. Enable Row Level Security

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_photos ENABLE ROW LEVEL SECURITY;
```

### 5. Create RLS Policies

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
DROP POLICY IF EXISTS "Allow all operations on product_photos" ON product_photos;

-- Create new policies (allow all operations for now)
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on product_photos" ON product_photos FOR ALL USING (true);
```

## Step 3: Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Name: `product-photos`
4. Make it **Public**
5. Click **Create bucket**

### Storage Bucket Settings

- **Name**: `product-photos`
- **Public**: Yes
- **File size limit**: 10MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

## Step 4: Update Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://zchzagodrwjlgqvcqvqz.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

To get your actual anon key:
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **anon/public** key
3. Replace `your_actual_anon_key_here` with the real key

## Step 5: Test the Setup

After completing the above steps:

1. Restart your development server: `npm run dev`
2. Try creating a new product
3. Check the **Table Editor** in Supabase to see if data is being inserted

## Troubleshooting

### 401 Unauthorized Error
- Make sure you're using the correct anon key
- Verify RLS policies are set to allow all operations
- Check that tables exist in the database

### Storage Errors
- Ensure the storage bucket is created and public
- Check that the bucket name matches `product-photos`

### Connection Issues
- Verify your Supabase URL is correct
- Check that your project is active and not paused

## Security Notes

The current setup allows all operations for simplicity. In production, you should:

1. Implement proper authentication
2. Create more restrictive RLS policies
3. Add user-based access controls
4. Implement proper file upload validation

## Next Steps

Once the database is set up, you can:
1. Creat products with photos
2. Browse the product gallery
3. Search and filter products
4. View product photos in full size
