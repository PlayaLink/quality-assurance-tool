import { useState } from 'react'
import { ProductLogForm } from './components/ProductLogForm'
import { ProductGallery } from './components/ProductGallery'
import { Icon } from './components/Icon'
import type { Product } from './types'

type View = 'home' | 'log' | 'gallery'

function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [recentProducts, setRecentProducts] = useState<Product[]>([])

  const handleProductCreated = (product: Product) => {
    setRecentProducts(prev => [product, ...prev.slice(0, 4)]) // Keep only 5 most recent
    setCurrentView('gallery')
  }

  const renderContent = () => {
    switch (currentView) {
      case 'log':
        return (
          <ProductLogForm 
            onProductCreated={handleProductCreated}
            dataTestId="main-product-form"
          />
        )
      case 'gallery':
        return <ProductGallery dataTestId="main-product-gallery" />
      default:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Quality Assurance Tool
              </h1>
              <p className="text-xl text-gray-600">
                Organize furniture product photos by SKU and serial number
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Icon name="plus" size={24} className="text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold">Log New Product</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Take photos and record details for a new furniture product.
                </p>
                <button
                  onClick={() => setCurrentView('log')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  data-testid="log-product-btn"
                  data-referenceid="log-product-btn"
                >
                  Start Logging
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Icon name="image" size={24} className="text-green-600 mr-3" />
                  <h2 className="text-xl font-semibold">View Gallery</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Browse and organize existing product photos by SKU and serial number.
                </p>
                <button
                  onClick={() => setCurrentView('gallery')}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                  data-testid="view-gallery-btn"
                  data-referenceid="view-gallery-btn"
                >
                  View Gallery
                </button>
              </div>
            </div>

            {recentProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Recently Added Products</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      data-testid={`recent-product-${product.id}`}
                      data-referenceid={`recent-product-${product.id}`}
                    >
                      <div className="font-medium text-gray-900">{product.sku}</div>
                      <div className="text-sm text-gray-600">Serial: {product.serial_number}</div>
                      {product.name && (
                        <div className="text-sm text-gray-500">{product.name}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(product.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentView('home')}
                className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
                data-testid="home-btn"
                data-referenceid="home-btn"
              >
                <Icon name="home" size={24} />
                <span>QA Tool</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('log')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  currentView === 'log'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                data-testid="nav-log-btn"
                data-referenceid="nav-log-btn"
              >
                <Icon name="plus" size={20} />
                <span>Log Product</span>
              </button>

              <button
                onClick={() => setCurrentView('gallery')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  currentView === 'gallery'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
                data-testid="nav-gallery-btn"
                data-referenceid="nav-gallery-btn"
              >
                <Icon name="image" size={20} />
                <span>Gallery</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
