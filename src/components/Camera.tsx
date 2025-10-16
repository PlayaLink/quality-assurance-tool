import { useState, useRef, useCallback, useEffect } from 'react'
import { Icon } from './Icon'

interface CameraProps {
  onPhotoTaken: (photoBlob: Blob) => void
  onClose: () => void
  dataTestId?: string
}

export const Camera = ({ onPhotoTaken, onClose, dataTestId }: CameraProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      
      streamRef.current = mediaStream
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.')
      console.error('Camera error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        onPhotoTaken(blob)
        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }, [onPhotoTaken, stopCamera])

  // Start camera when component mounts
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })
        
        streamRef.current = mediaStream
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        setError('Unable to access camera. Please check permissions.')
        console.error('Camera error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeCamera()
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, []) // Empty dependency array to run only once

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col"
      data-testid={dataTestId}
      data-referenceid="camera-overlay"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black/50 text-white">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-full"
          data-testid="camera-close-btn"
          data-referenceid="camera-close"
        >
          <Icon name="x" size={24} />
        </button>
        <h2 className="text-lg font-semibold">Take Photo</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white">Loading camera...</div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white p-4">
              <p className="mb-4">{error}</p>
              <button
                onClick={async () => {
                  try {
                    setIsLoading(true)
                    setError(null)
                    
                    // Stop any existing stream first
                    if (streamRef.current) {
                      streamRef.current.getTracks().forEach(track => track.stop())
                    }
                    
                    const mediaStream = await navigator.mediaDevices.getUserMedia({
                      video: { 
                        facingMode: 'environment',
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                      }
                    })
                    
                    streamRef.current = mediaStream
                    setStream(mediaStream)
                    if (videoRef.current) {
                      videoRef.current.srcObject = mediaStream
                    }
                  } catch (err) {
                    setError('Unable to access camera. Please check permissions.')
                    console.error('Camera error:', err)
                  } finally {
                    setIsLoading(false)
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                data-testid="camera-retry-btn"
                data-referenceid="camera-retry"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {stream && !error && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              data-testid="camera-video"
              data-referenceid="camera-video"
            />
            
            {/* Camera Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button
                onClick={takePhoto}
                className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-colors"
                data-testid="camera-capture-btn"
                data-referenceid="camera-capture"
              >
                <div className="w-12 h-12 bg-white rounded-full mx-auto border-2 border-gray-400" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
