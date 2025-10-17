import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Product, ProductPhoto } from '../types'
import { Icon } from './Icon'

interface ProductGalleryProps {
  dataTestId?: string
}

export const ProductGallery = ({ dataTestId }: ProductGalleryProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productPhotos, setProductPhotos] = useState<ProductPhoto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProductPhotos = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_photos')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProductPhotos(data || [])
    } catch (err) {
      console.error('Error fetching photos:', err)
    }
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    fetchProductPhotos(product.id)
  }

  const filteredProducts = products.filter(product =>
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading products...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    )
  }

  return (
    <div 
      className="max-w-6xl mx-auto p-6"
      data-testid={dataTestId}
      data-referenceid="product-gallery"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Gallery</h2>
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Icon name="search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by SKU, serial, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="search-input"
              data-referenceid="search-input"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Products ({filteredProducts.length})</h3>
            
            {filteredProducts.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                {searchTerm ? 'No products found matching your search.' : 'No products found.'}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    data-testid={`product-item-${product.id}`}
                    data-referenceid={`product-item-${product.id}`}
                  >
                    <div className="font-medium text-gray-900">{product.sku}</div>
                    <div className="text-sm text-gray-600">Collection: {product.collection}</div>
                    <div className="text-sm text-gray-600">Dimensions: {product.length}" × {product.width}"</div>
                    {product.name && (
                      <div className="text-sm text-gray-500">{product.name}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(product.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            {selectedProduct ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedProduct.sku}</h3>
                    <p className="text-sm text-gray-600">
                      Collection: {selectedProduct.collection} • Dimensions: {selectedProduct.length}" × {selectedProduct.width}"
                      {selectedProduct.name && ` • ${selectedProduct.name}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    data-testid="close-product-btn"
                    data-referenceid="close-product-btn"
                  >
                    <Icon name="x" size={20} />
                  </button>
                </div>

                {productPhotos.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Icon name="image" size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No photos available for this product.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {productPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative group"
                        data-testid={`photo-item-${photo.id}`}
                        data-referenceid={`photo-item-${photo.id}`}
                      >
                        <img
                          src={photo.photo_url}
                          alt={photo.photo_name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => window.open(photo.photo_url, '_blank')}
                            className="opacity-0 group-hover:opacity-100 bg-white p-2 rounded-full shadow-lg transition-opacity"
                            data-testid={`view-photo-${photo.id}`}
                            data-referenceid={`view-photo-${photo.id}`}
                          >
                            <Icon name="search" size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-black bg-opacity-75 text-white text-xs p-2 rounded">
                            {new Date(photo.taken_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Icon name="package" size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Select a product to view its photos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
