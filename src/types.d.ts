export interface Product {
  id: string
  sku: string
  collection: string
  length: number
  width: number
  name?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface ProductPhoto {
  id: string
  product_id: string
  photo_url: string
  photo_name: string
  taken_at: string
  created_at: string
}

export interface Collection {
  id: string
  key: string
  name: string
  created_at: string
  updated_at: string
}

export interface Sku {
  id: string
  key: string
  display_name: string
  created_at: string
  updated_at: string
}
