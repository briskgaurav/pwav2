'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'

interface UniversalCameraCaptureProps {
  onCapture: (imageData: string) => void
  onError?: (error: string) => void
  facingMode?: 'user' | 'environment'
  captureButtonText?: string
  verifyingText?: string
}

export default function UniversalCameraCapture({
  onCapture,
  onError,
  facingMode = 'user',
  captureButtonText = 'Capture',
  verifyingText = 'Processing...'
}: UniversalCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [cameraMode, setCameraMode] = useState<'stream' | 'fallback' | 'checking'>('checking')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Check if getUserMedia is available and working
  const checkCameraSupport = useCallback(async () => {
    // Check if mediaDevices API exists
    if (!navigator.mediaDevices?.getUserMedia) {
      console.log('getUserMedia not available, using fallback')
      setCameraMode('fallback')
      return
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      // Success - we can use stream mode
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCameraMode('stream')
    } catch (error) {
      console.log('getUserMedia failed, using fallback:', error)
      setCameraMode('fallback')
    }
  }, [facingMode])

  useEffect(() => {
    checkCameraSupport()

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [checkCameraSupport])

  // Capture from video stream
  const captureFromStream = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Mirror if using front camera
    if (facingMode === 'user') {
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
    }

    context.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(imageData)
    setIsProcessing(true)
    onCapture(imageData)
  }

  // Handle file input (fallback mode)
  const handleFileCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      setCapturedImage(imageData)
      setIsProcessing(true)
      onCapture(imageData)
    }
    reader.onerror = () => {
      setCameraError('Failed to read captured image')
      onError?.('Failed to read captured image')
    }
    reader.readAsDataURL(file)
  }

  // Trigger file input click
  const triggerFileCapture = () => {
    fileInputRef.current?.click()
  }

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null)
    setIsProcessing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Render loading state
  if (cameraMode === 'checking') {
    return (
      <div className="h-screen flex flex-col bg-black">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-white text-center">
            <p>Initializing camera...</p>
          </div>
        </div>
      </div>
    )
  }

  // Render captured image preview
  if (capturedImage) {
    return (
      <div className="h-screen flex flex-col bg-black">
        <div className="flex-1 flex justify-center items-center overflow-hidden">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
            style={facingMode === 'user' ? { transform: 'scaleX(-1)' } : undefined}
          />
        </div>
        <div className="w-full absolute z-10 bottom-0 p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          {isProcessing ? (
            <div className="bg-primary p-4 text-center text-white rounded-full w-full font-medium text-base opacity-75">
              {verifyingText}
            </div>
          ) : (
            <button
              onClick={handleRetake}
              className="bg-white p-4 text-center text-black rounded-full w-full font-medium text-base"
            >
              Retake
            </button>
          )}
        </div>
      </div>
    )
  }

  // Stream mode - live camera preview
  if (cameraMode === 'stream') {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex-col bg-zinc-400 flex justify-center items-center overflow-auto">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={facingMode === 'user' ? { transform: 'scaleX(-1)' } : undefined}
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="w-full absolute z-10 bottom-0 p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <button
            onClick={captureFromStream}
            disabled={isProcessing}
            className={`bg-primary p-4 text-center text-white flex items-center justify-center rounded-full w-full font-medium text-base transition-all ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {captureButtonText}
          </button>
        </div>
      </div>
    )
  }

  // Fallback mode - file input with camera capture
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex-col bg-zinc-800 flex justify-center items-center overflow-auto">
        <div className="text-white text-center p-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-zinc-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Take a Photo</h2>
          <p className="text-zinc-400 text-sm">
            Tap the button below to open your camera and take a photo
          </p>
        </div>

        {/* Hidden file input for camera capture */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture={facingMode === 'user' ? 'user' : 'environment'}
          onChange={handleFileCapture}
          className="hidden"
        />
      </div>

      <div className="w-full absolute z-10 bottom-0 p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
        <button
          onClick={triggerFileCapture}
          className="bg-primary p-4 text-center text-white flex items-center justify-center rounded-full w-full font-medium text-base"
        >
          Open Camera
        </button>
      </div>
    </div>
  )
}
