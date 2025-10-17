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


  const takePhoto = useCallback(() => {
    console.log('📸 takePhoto called')
    console.log('Video ref:', videoRef.current)
    console.log('Canvas ref:', canvasRef.current)
    
    if (!videoRef.current || !canvasRef.current) {
      console.error('❌ Missing video or canvas ref')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    console.log('Video element:', video)
    console.log('Canvas element:', canvas)
    console.log('Canvas context:', context)
    console.log('Video dimensions:', { width: video.videoWidth, height: video.videoHeight })
    console.log('Video ready state:', video.readyState)

    if (!context) {
      console.error('❌ Could not get canvas context')
      return
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    console.log('Canvas dimensions set:', { width: canvas.width, height: canvas.height })

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    console.log('✅ Video frame drawn to canvas')

    // Convert to blob
    canvas.toBlob((blob) => {
      console.log('Canvas toBlob callback called')
      console.log('Blob result:', blob)
      if (blob) {
        console.log('✅ Blob created successfully, size:', blob.size)
        onPhotoTaken(blob)
        stopCamera()
      } else {
        console.error('❌ Failed to create blob from canvas')
      }
    }, 'image/jpeg', 0.9)
  }, [onPhotoTaken, stopCamera])

  // Start camera when component mounts
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        console.log('🎥 Initializing camera...')
        console.log('Current location:', location.href)
        console.log('Protocol:', location.protocol)
        console.log('Hostname:', location.hostname)
        
        setIsLoading(true)
        setError(null)
        
        // Check if we're on HTTPS (required for camera access in production)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
          console.error('❌ HTTPS required for camera access')
          setError('Camera access requires HTTPS. Please use a secure connection.')
          return
        }
        
        console.log('✅ HTTPS check passed, requesting camera access...')
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })
        
        console.log('✅ Camera access granted, stream:', mediaStream)
        streamRef.current = mediaStream
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          console.log('✅ Video element srcObject set')
        }
      } catch (err) {
        console.error('Camera error:', err)
        
        // Provide specific error messages based on error type
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera access denied. Please allow camera permissions and try again.')
          } else if (err.name === 'NotFoundError') {
            setError('No camera found on this device.')
          } else if (err.name === 'NotSupportedError') {
            setError('Camera not supported. Please use HTTPS or a modern browser.')
          } else if (err.name === 'NotReadableError') {
            setError('Camera is already in use by another application.')
          } else {
            setError('Unable to access camera. Please check permissions and ensure you are using HTTPS.')
          }
        } else {
          setError('Unable to access camera. Please check permissions and ensure you are using HTTPS.')
        }
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
                onClick={() => {
                  console.log('🔴 Camera capture button clicked!')
                  console.log('Current stream:', streamRef.current)
                  console.log('Current stream state:', stream)
                  takePhoto()
                }}
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
