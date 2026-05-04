'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import LayoutSheet from '@/components/ui/LayoutSheet'
import { routes } from '@/lib/routes'

export default function page() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const router = useRouter()

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      setPermissionDenied(false)

      // Check if mediaDevices API is available
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera is not supported on this device or browser. Please use a modern browser with HTTPS.')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      if (error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')) {
        setPermissionDenied(true)
        setCameraError('Camera permission denied. Please allow camera access to continue.')
      } else if (error instanceof DOMException && error.name === 'NotFoundError') {
        setCameraError('No camera found on this device.')
      } else {
        setCameraError('Unable to access camera. Please check your device settings.')
      }
    }
  }, [])

  useEffect(() => {
    startCamera()

    // Cleanup function to stop the camera when component unmounts
    return () => {
      const video = videoRef.current
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [startCamera])

  const handleRequestPermission = () => {
    startCamera()
  }

  const handleCapture = () => {
    setIsVerifying(true)
    setTimeout(() => {
      router.push(routes.chooseOptions)
    }, 2000)
  }

  return (
    <LayoutSheet routeTitle='Forgot PIN' needPadding={false}>

      <div className='w-full flex-1 h-full relative'>

        <div className="flex-1 absolute inset-0 bg-zinc-400 flex flex-col justify-center items-center">
          {cameraError ? (
            <div className="text-white pointer-events-none text-center p-4 flex flex-col items-center gap-4">
              <p>{cameraError}</p>
              {permissionDenied && (
                <button
                  onClick={handleRequestPermission}
                  className="bg-white text-black px-6 py-3 rounded-full font-medium"
                >
                  Grant Camera Permission
                </button>
              )}
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }} // Mirror the front camera
            />
          )}
          <div className="w-full absolute z-10 bottom-0 p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
            <button
              onClick={handleCapture}
              disabled={isVerifying}
              className={`bg-primary p-4 text-center text-white flex items-center justify-center rounded-full w-full font-medium text-base transition-all ${isVerifying ? 'opacity-100 brightness-75 cursor-not-allowed' : ''}`}
            >
              {isVerifying ? 'Verifying...' : 'Capture'}
            </button>
          </div>
        </div>
      </div>

    </LayoutSheet>
  )
}
