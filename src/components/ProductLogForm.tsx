import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Product, Sku } from '../types'
import { Camera } from './Camera'
import { Icon } from './Icon'

interface ProductLogFormProps {
  onProductCreated: (product: Product) => void
  dataTestId?: string
}

export const ProductLogForm = ({ onProductCreated, dataTestId }: ProductLogFormProps) => {
  const [formData, setFormData] = useState({
    sku: '',
    serialNumber: '',
    name: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [photos, setPhotos] = useState<Blob[]>([])
  const [error, setError] = useState<string | null>(null)
  const [skus, setSkus] = useState<Sku[]>([])
  const [isLoadingSkus, setIsLoadingSkus] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load SKUs on component mount
  useEffect(() => {
    const fetchSkus = async () => {
      try {
        const { data, error } = await supabase
          .from('skus')
          .select('*')
          .order('key')

        if (error) {
          console.error('Error fetching SKUs:', error)
          setError('Failed to load SKU options')
        } else {
          setSkus(data || [])
        }
      } catch (err) {
        console.error('Error fetching SKUs:', err)
        setError('Failed to load SKU options')
      } finally {
        setIsLoadingSkus(false)
      }
    }

    fetchSkus()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      
      // Auto-populate product name when SKU is selected
      if (name === 'sku' && value) {
        const selectedSku = skus.find(sku => sku.key === value)
        if (selectedSku) {
          newData.name = selectedSku.display_name
        }
      }
      
      return newData
    })
  }

  const handlePhotoTaken = (photoBlob: Blob) => {
    console.log('📷 Photo taken callback received')
    console.log('Photo blob:', photoBlob)
    console.log('Photo blob size:', photoBlob.size)
    console.log('Photo blob type:', photoBlob.type)
    setPhotos(prev => [...prev, photoBlob])
    setShowCamera(false)
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handlePhotoLibrary = () => {
    console.log('📷 Opening photo library')
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('📷 Photo selected from library:', file.name, file.size)
      // Convert file to blob and pass to callback
      const reader = new FileReader()
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: file.type })
        setPhotos(prev => [...prev, blob])
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const uploadPhoto = async (photoBlob: Blob, productId: string, photoIndex: number) => {
    const fileName = `${productId}_photo_${photoIndex}_${Date.now()}.jpg`
    const file = new File([photoBlob], fileName, { type: 'image/jpeg' })

    const { error } = await supabase.storage
      .from('product-photos')
      .upload(fileName, file)

    if (error) {
      console.error('Photo upload error:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-photos')
      .getPublicUrl(fileName)

    // Save photo record to database
    const { error: dbError } = await supabase
      .from('product_photos')
      .insert({
        product_id: productId,
        photo_url: publicUrl,
        photo_name: fileName
      })

    if (dbError) {
      console.error('Photo record error:', dbError)
      return null
    }

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Create product record
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          sku: formData.sku,
          serial_number: formData.serialNumber,
          name: formData.name || null,
          description: formData.description || null
        })
        .select()
        .single()

      if (productError) {
        throw new Error(productError.message)
      }

      // Upload photos
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          await uploadPhoto(photos[i], product.id, i)
        }
      }

      onProductCreated(product)
      
      // Reset form
      setFormData({
        sku: '',
        serialNumber: '',
        name: '',
        description: ''
      })
      setPhotos([])
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div 
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      data-testid={dataTestId}
      data-referenceid="product-log-form"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Log New Product</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SKU Field */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
            <Icon name="hash" size={16} className="inline mr-1" />
            Product SKU *
          </label>
          {isLoadingSkus ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
              Loading SKU options...
            </div>
          ) : (
            <select
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="sku-select"
              data-referenceid="sku-select"
            >
              <option value="">Select a SKU</option>
              {skus.map((sku) => (
                <option key={sku.id} value={sku.key}>
                  {sku.key} - {sku.display_name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Serial Number Field */}
        <div>
          <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
            <Icon name="package" size={16} className="inline mr-1" />
            Serial Number *
          </label>
          <input
            type="text"
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter serial number"
            data-testid="serial-input"
            data-referenceid="serial-input"
          />
        </div>

        {/* Product Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
            {formData.sku && (
              <span className="text-xs text-gray-500 ml-2">(auto-filled from SKU)</span>
            )}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product name (optional)"
            data-testid="name-input"
            data-referenceid="name-input"
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product description (optional)"
            data-testid="description-input"
            data-referenceid="description-input"
          />
        </div>

        {/* Photo Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Icon name="camera" size={16} className="inline mr-1" />
            Product Photos
          </label>
          
          <div className="space-y-4">
            {/* Photo Preview Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Product photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      data-testid={`remove-photo-${index}`}
                      data-referenceid={`remove-photo-${index}`}
                    >
                      <Icon name="x" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Photo Button */}
            <button
              type="button"
              onClick={handlePhotoLibrary}
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              data-testid="add-photo-btn"
              data-referenceid="add-photo-btn"
            >
              <Icon name="image" size={16} />
              <span>Photo Library</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="submit-btn"
          data-referenceid="submit-btn"
        >
          {isSubmitting ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>

      {/* Camera Modal */}
      {showCamera && (
        <Camera
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setShowCamera(false)}
          dataTestId="product-camera"
        />
      )}
      
      {/* Hidden file input for photo library */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="photo-library-input"
        data-referenceid="photo-library-input"
      />
    </div>
  )
}
