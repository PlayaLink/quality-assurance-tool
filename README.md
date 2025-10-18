# Quality Assurance Tool

A modern web application for taking pictures of finished furniture products and organizing them by product SKU and serial number.

## Features

- **Product Logging**: Take photos and record product details (SKU, serial number, name, description)
- **Camera Integration**: Built-in camera component for capturing product photos
- **Photo Organization**: Gallery view to browse and organize photos by product
- **Search Functionality**: Search products by SKU, serial number, or name
- **Modern UI**: Clean, responsive design built with Tailwind CSS
- **Database Storage**: Secure storage using Supabase PostgreSQL
- **Photo Storage**: Cloud storage for product images

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Camera**: Web API (getUserMedia)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://zchzagodrwjlgqvcqvqz.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Database Setup

The application will automatically create the required database tables and storage bucket on first run. The database schema includes:

- **products**: Stores product information (SKU, serial number, name, description)
- **product_photos**: Stores photo metadata and URLs

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Logging a New Product

1. Click "Create Product" from the navigation or home page
2. Fill in the required fields:
   - **SKU**: Product SKU (required)
   - **Serial Number**: Product serial number (required)
   - **Name**: Product name (optional)
   - **Description**: Product description (optional)
3. Take photos using the built-in camera
4. Click "Create Product" to save

### Viewing Products

1. Click "Gallery" from the navigation
2. Browse products in the left panel
3. Click on a product to view its photos
4. Use the search bar to find specific products
5. Click on photos to view them in full size

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) NOT NULL UNIQUE,
  serial_number VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Product Photos Table
```sql
CREATE TABLE product_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_name VARCHAR(255) NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Camera.tsx      # Camera component for taking photos
│   ├── Icon.tsx        # Icon component using Lucide React
│   ├── ProductGallery.tsx  # Gallery for viewing products
│   └── ProductLogForm.tsx  # Form for logging new products
├── lib/                # Utility libraries
│   ├── supabase.ts     # Supabase client configuration
│   ├── setup.ts        # Database and storage setup
│   └── database.sql    # Database schema
└── App.tsx            # Main application component
```

### Key Components

- **Camera**: Handles camera access and photo capture
- **ProductLogForm**: Form for creating new products with photo upload
- **ProductGallery**: Displays products and their associated photos
- **Icon**: Centralized icon component using Lucide React

## Browser Compatibility

- Modern browsers with camera API support
- HTTPS required for camera access (except localhost)
- Mobile-friendly responsive design

## Security Features

- Row Level Security (RLS) enabled on all tables
- Secure photo storage with access controls
- Input validation and sanitization
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.