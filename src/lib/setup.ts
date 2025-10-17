import { supabase } from './supabase'

export const setupDatabase = async () => {
  try {
    console.log('Setting up database tables...')
    
    // Create products table
    const { error: productsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          sku VARCHAR(100) NOT NULL UNIQUE,
          serial_number VARCHAR(100) NOT NULL UNIQUE,
          name VARCHAR(255),
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (productsError) {
      console.error('Error creating products table:', productsError)
    }

    // Create product_photos table
    const { error: photosError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS product_photos (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          photo_url TEXT NOT NULL,
          photo_name VARCHAR(255) NOT NULL,
          taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (photosError) {
      console.error('Error creating product_photos table:', photosError)
    }

    // Create indexes
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
        CREATE INDEX IF NOT EXISTS idx_products_serial_number ON products(serial_number);
        CREATE INDEX IF NOT EXISTS idx_product_photos_product_id ON product_photos(product_id);
      `
    })

    if (indexError) {
      console.error('Error creating indexes:', indexError)
    }

    console.log('Database setup completed!')
  } catch (error) {
    console.error('Database setup failed:', error)
  }
}

export const setupStorage = async () => {
  try {
    console.log('Setting up storage bucket...')
    
    // Create storage bucket for product photos
    const { error } = await supabase.storage.createBucket('product-photos', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    })

    if (error && !error.message.includes('already exists')) {
      console.error('Error creating storage bucket:', error)
    } else {
      console.log('Storage bucket setup completed!')
    }
  } catch (error) {
    console.error('Storage setup failed:', error)
  }
}

export const initializeApp = async () => {
  await setupDatabase()
  await setupStorage()
}
