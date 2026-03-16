'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import Image from 'next/image'
import { routes } from '@/lib/routes'

const SCANNER_SIZE = 240
const CORNER_SIZE = 45

// Flash control functions for Android WebView
function flashOn() {
  if (typeof window !== "undefined" && (window as unknown as { AndroidFlash?: { flashOn: () => void } }).AndroidFlash) {
    (window as unknown as { AndroidFlash: { flashOn: () => void } }).AndroidFlash.flashOn();
  } else {
    console.log("Flash API not available");
  }
}

function flashOff() {
  if (typeof window !== "undefined" && (window as unknown as { AndroidFlash?: { flashOff: () => void } }).AndroidFlash) {
    (window as unknown as { AndroidFlash: { flashOff: () => void } }).AndroidFlash.flashOff();
  }
}

export default function ScanPage() {
  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanLineRef = useRef<HTMLDivElement>(null)
  const scannerBoxRef = useRef<HTMLDivElement>(null)
  const cornerTLRef = useRef<HTMLDivElement>(null)
  const cornerTRRef = useRef<HTMLDivElement>(null)
  const cornerBLRef = useRef<HTMLDivElement>(null)
  const cornerBRRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const hasScanned = useRef(false)
  const scanRafRef = useRef<number>(0)
  const isMountedRef = useRef(true)

  const [cameraError, setCameraError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [flashOnState, setFlashOnState] = useState(false)
  const [flashSupported, setFlashSupported] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    cancelAnimationFrame(scanRafRef.current)
    // Turn off flash when stopping camera
    if (flashOnState) {
      flashOff()
      setFlashOnState(false)
    }
  }, [flashOnState])

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      setPermissionDenied(false)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera is not supported on this device or browser. Please use a modern browser with HTTPS.')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      
      // Check if component is still mounted before proceeding
      if (!isMountedRef.current) {
        stream.getTracks().forEach(track => track.stop())
        return
      }
      
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        try {
          await videoRef.current.play()
        } catch (playError) {
          // Ignore AbortError as it happens when component unmounts during play
          if (playError instanceof DOMException && playError.name === 'AbortError') {
            console.log('Video play was aborted (component likely unmounted)')
            return
          }
          throw playError
        }
      }

      // Check if AndroidFlash is available
      if (typeof window !== "undefined" && (window as unknown as { AndroidFlash?: unknown }).AndroidFlash) {
        setFlashSupported(true)
      } else {
        // Fallback: check native torch capability
        const track = stream.getVideoTracks()[0]
        const caps = track.getCapabilities?.() as Record<string, unknown> | undefined
        if (caps && 'torch' in caps) setFlashSupported(true)
      }
    } catch (error) {
      // Don't set error state if component unmounted
      if (!isMountedRef.current) return
      
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

  const toggleFlash = useCallback(() => {
    const newFlashState = !flashOnState
    if (newFlashState) {
      flashOn()
    } else {
      flashOff()
    }
    setFlashOnState(newFlashState)
  }, [flashOnState])

  const handleGalleryPress = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log('Selected image:', file.name)
        // Redirect to payment amount page after selecting an image
        stopCamera()
        router.push(routes.paymentAmount)
      }
    }
    input.click()
  }, [stopCamera, router])

  const handleClose = useCallback(() => {
    if ('vibrate' in navigator) navigator.vibrate(10)
    stopCamera()
    router.back()
  }, [stopCamera, router])

  const handleRequestPermission = useCallback(() => {
    startCamera()
  }, [startCamera])

  // --- Camera init & cleanup ---
  useEffect(() => {
    isMountedRef.current = true
    startCamera()
    return () => {
      isMountedRef.current = false
      stopCamera()
    }
  }, [startCamera, stopCamera])

  // --- QR code detection loop ---
  useEffect(() => {
    if (cameraError) return

    const scan = () => {
      if (!videoRef.current || !canvasRef.current || hasScanned.current || !isMountedRef.current) return

      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
        scanRafRef.current = requestAnimationFrame(scan)
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      if ('BarcodeDetector' in window) {
        const detector = new (window as unknown as { BarcodeDetector: new (opts: { formats: string[] }) => { detect: (source: HTMLCanvasElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector({ formats: ['qr_code'] })
        detector.detect(canvas).then((barcodes) => {
          if (barcodes.length > 0 && !hasScanned.current && isMountedRef.current) {
            hasScanned.current = true
            setResult(barcodes[0].rawValue)
            if ('vibrate' in navigator) navigator.vibrate([50, 30, 50])
            setTimeout(() => router.push(routes.paymentAmount), 1500)
          }
        }).catch(() => { /* detection unavailable */ })
      }

      scanRafRef.current = requestAnimationFrame(scan)
    }

    scanRafRef.current = requestAnimationFrame(scan)
    return () => cancelAnimationFrame(scanRafRef.current)
  }, [cameraError, router])

  // --- GSAP animations ---
  useEffect(() => {
    if (cameraError) return

    const ctx = gsap.context(() => {
      // Entrance: fade in the overlay + bottom section
      if (overlayRef.current) {
        gsap.from(overlayRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' })
      }
      if (bottomRef.current) {
        gsap.from(bottomRef.current, { y: 60, opacity: 0, duration: 0.5, delay: 0.2, ease: 'power3.out' })
      }

      // Scan line — sweeps up and down
      if (scanLineRef.current) {
        gsap.to(scanLineRef.current, {
          y: SCANNER_SIZE - 48,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // Breathing scale on scanner box
      if (scannerBoxRef.current) {
        gsap.to(scannerBoxRef.current, {
          scale: 1.05,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // Corner bracket pulse
      const corners = [cornerTLRef, cornerTRRef, cornerBLRef, cornerBRRef]
      corners.forEach(ref => {
        if (ref.current) {
          gsap.to(ref.current, {
            width: CORNER_SIZE * 0.8,
            height: CORNER_SIZE * 0.8,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        }
      })
    })

    return () => ctx.revert()
  }, [cameraError])

  // --- Main scanner UI ---
  return (
    <div className="flex-1 flex flex-col bg-black relative overflow-hidden">
      {/* Camera feed or error state */}
      {cameraError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-8 gap-6">
          <h2 className="text-white text-2xl font-semibold text-center">Camera Access Required</h2>
          <p className="text-white/70 text-base text-center leading-relaxed">
            {cameraError}
          </p>
          {permissionDenied && (
            <button 
              onClick={handleRequestPermission} 
              className="bg-primary py-4 px-10 rounded-2xl"
            >
              <span className="text-white font-semibold">Grant Camera Permission</span>
            </button>
          )}
          <button onClick={handleClose} className="p-3">
            <span className="text-white/60 text-sm">Go Back</span>
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover border-0 outline-none"
            style={{ border: 'none' }}
            playsInline
            muted
            autoPlay
          />

          {/* Hidden canvas for QR detection */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Dark overlay with scanner cutout */}
          <div ref={overlayRef} className="absolute inset-0 bg-black/40 z-1" />

        

          {/* Scanner frame area */}
          <div className="flex-1 relative z-10 flex items-center justify-center pb-[10%]">
            {/* Breathing wrapper */}
            <div
              ref={scannerBoxRef}
              className="p-5 bg-white/10 rounded-3xl"
              style={{ willChange: 'transform' }}
            >
              <div className="relative" style={{ width: SCANNER_SIZE, height: SCANNER_SIZE }}>
                {/* Corner brackets */}
                <div
                  ref={cornerTLRef}
                  className="absolute top-0 left-0 border-t-4 border-l-4 border-white rounded-tl-[20px]"
                  style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
                />
                <div
                  ref={cornerTRRef}
                  className="absolute top-0 right-0 border-t-4 border-r-4 border-white rounded-tr-[20px]"
                  style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
                />
                <div
                  ref={cornerBLRef}
                  className="absolute bottom-0 left-0 border-b-4 border-l-4 border-white rounded-bl-[20px]"
                  style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
                />
                <div
                  ref={cornerBRRef}
                  className="absolute bottom-0 right-0 border-b-4 border-r-4 border-white rounded-br-[20px]"
                  style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
                />

                {/* Scanning line */}
                <div
                  ref={scanLineRef}
                  className="absolute left-6 right-6 h-[3px] bg-white rounded-full top-6"
                  style={{ boxShadow: '0 0 12px rgba(255,255,255,1)', willChange: 'transform' }}
                />

                {/* Scanned result toast */}
                {result && (
                  <div className="absolute top-[110%] -left-2.5 -right-2.5 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80">
                    <div className="px-5 py-3.5 text-center">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {result.length > 40 ? `${result.substring(0, 40)}…` : result}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div ref={bottomRef} className="relative z-10 rounded-t-3xl overflow-hidden">
            <div className="flex flex-col items-center pt-8 pb-[max(2rem,calc(env(safe-area-inset-bottom,0px)+2rem))]">
              <p className="text-white/80 text-[15px] font-medium text-center mb-7">
                Align QR code within the frame to scan
              </p>

              <div className="flex justify-center gap-14">
                {/* Gallery */}
                <button onClick={handleGalleryPress} className="flex flex-col items-center gap-2.5 group">
                  <div className="w-[60px] h-[60px] rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-active:scale-90 transition-transform">
                    <Image src="/svg/gallery.svg" alt="Gallery" width={24} height={24} />
                  </div>
                  <span className="text-white text-[13px] font-medium">Gallery</span>
                </button>

                {/* Flash */}
                {/* {flashSupported && ( */}
                  <button onClick={toggleFlash} className="flex flex-col items-center gap-2.5 group">
                    <div className={`w-[60px] h-[60px] rounded-full backdrop-blur-sm flex items-center justify-center group-active:scale-90 transition-transform ${flashOnState ? 'bg-primary-light' : 'bg-white/30'}`}>
                      <Image 
                        src={flashOnState ? '/svg/thunder-on.svg' : '/svg/thunder-off.svg'} 
                        alt="Flash" 
                        width={16} 
                        height={22} 
                      />
                    </div>
                    <span className="text-white text-[13px] font-medium">
                      {flashOnState ? 'Flash On' : 'Flash Off'}
                    </span>
                  </button>
                {/* )} */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
