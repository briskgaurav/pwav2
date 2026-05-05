'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import gsap from 'gsap'

import { useBackRedirect } from '@/hooks/useBackRedirect'
import { routes } from '@/lib/routes'
import { parseQRData } from '@/lib/parse-qr'
import Toaster from '@/components/ui/Toaster'

const SCANNER_SIZE = 240
const CORNER_SIZE = 45

export default function QRScanScreen() {
  const router = useRouter()
  useBackRedirect(routes.instacard)

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
  const [flashOn, setFlashOn] = useState(false)
  const [flashSupported, setFlashSupported] = useState(false)
  // No UI for result state
  const [result, setResult] = useState<string | null>(null)
  const [qrError, setQrError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const processingOverlayRef = useRef<HTMLDivElement>(null)
  const qrErrorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // --- QR Validation ---
  const isValidQRCode = useCallback((data: string): boolean => {
    if (!data || data.trim().length === 0) return false
    try {
      const url = new URL(data)
      if (['http:', 'https:', 'upi:'].includes(url.protocol)) return true
    } catch { }
    if (/^upi:\/\//i.test(data)) return true
    if (/^\d{6,}$/.test(data.trim())) return true
    if (data.trim().length < 4) return false
    return true
  }, [])

  const showQrError = useCallback((msg: string) => {
    setQrError(msg)
    if (qrErrorTimer.current) clearTimeout(qrErrorTimer.current)
    qrErrorTimer.current = setTimeout(() => setQrError(null), 3000)
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100])
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    cancelAnimationFrame(scanRafRef.current)
  }, [])

  const handleValidQR = useCallback((data: string) => {
    if (hasScanned.current) return
    if (!isValidQRCode(data)) {
      showQrError('Invalid QR code. Please scan a valid payment QR.')
      return
    }
    hasScanned.current = true
    if ('vibrate' in navigator) navigator.vibrate([50, 30, 50])
    stopCamera()
    setIsProcessing(true)

    // Parse dynamic QR data and forward as search params
    const parsed = parseQRData(data)
    const params = new URLSearchParams()
    if (parsed.amount) params.set('amount', parsed.amount)
    if (parsed.merchantName) params.set('merchantName', parsed.merchantName)
    if (parsed.description) params.set('description', parsed.description)
    params.set('qrRaw', data)

    const query = params.toString()
    const url = query ? `${routes.makePayment}?${query}` : routes.makePayment
    setTimeout(() => router.push(url), 2000)
  }, [isValidQRCode, showQrError, stopCamera, router])

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      setPermissionDenied(false)

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera is not supported on this device or browser. Please use a modern browser with HTTPS.')
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })

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
          if (playError instanceof DOMException && playError.name === 'AbortError') {
            console.log('Video play was aborted (component likely unmounted)')
            return
          }
          throw playError
        }
      }

      const track = stream.getVideoTracks()[0]
      const caps = track.getCapabilities?.() as Record<string, unknown> | undefined
      if (caps && 'torch' in caps) setFlashSupported(true)
    } catch (error) {
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

  const toggleFlash = useCallback(async () => {
    if (!streamRef.current) return
    const track = streamRef.current.getVideoTracks()[0]
    if (!track) return

    const newFlashState = !flashOn
    try {
      if ('ImageCapture' in window) {
        const imageCapture = new (window as unknown as { ImageCapture: new (track: MediaStreamTrack) => { getPhotoCapabilities: () => Promise<{ fillLightMode?: string[] }>; setOptions: (opts: { fillLightMode: string }) => Promise<void> } }).ImageCapture(track)
        const capabilities = await imageCapture.getPhotoCapabilities()
        if (capabilities.fillLightMode?.includes('flash')) {
          await imageCapture.setOptions({ fillLightMode: newFlashState ? 'flash' : 'off' })
          setFlashOn(newFlashState)
          return
        }
      }
      await track.applyConstraints({
        advanced: [{ torch: newFlashState } as MediaTrackConstraintSet]
      })
      setFlashOn(newFlashState)
    } catch (err) {
      console.error('Flash toggle failed:', err)
      try {
        const constraints = { torch: newFlashState } as MediaTrackConstraintSet
        await track.applyConstraints(constraints)
        setFlashOn(newFlashState)
      } catch {
        /* flash not available */
      }
    }
  }, [flashOn])

  const handleGalleryPress = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const img = new window.Image()
      img.src = URL.createObjectURL(file)
      img.onload = async () => {
        const cvs = document.createElement('canvas')
        cvs.width = img.naturalWidth
        cvs.height = img.naturalHeight
        const ctx2 = cvs.getContext('2d')
        if (!ctx2) { showQrError('Could not process image.'); return }
        ctx2.drawImage(img, 0, 0)
        URL.revokeObjectURL(img.src)

        if ('BarcodeDetector' in window) {
          try {
            const detector = new (window as unknown as { BarcodeDetector: new (o: { formats: string[] }) => { detect: (s: HTMLCanvasElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector({ formats: ['qr_code'] })
            const barcodes = await detector.detect(cvs)
            if (barcodes.length > 0) {
              handleValidQR(barcodes[0].rawValue)
            } else {
              showQrError('No QR code found in this image.')
            }
          } catch {
            showQrError('QR detection is not supported on this device.')
          }
        } else {
          showQrError('QR detection is not supported on this browser.')
        }
      }
      img.onerror = () => showQrError('Could not load the selected image.')
    }
    input.click()
  }, [handleValidQR, showQrError])

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
            handleValidQR(barcodes[0].rawValue)
          }
        }).catch(() => { /* detection unavailable */ })
      }

      scanRafRef.current = requestAnimationFrame(scan)
    }

    scanRafRef.current = requestAnimationFrame(scan)
    return () => cancelAnimationFrame(scanRafRef.current)
  }, [cameraError, handleValidQR])

  // --- GSAP animations ---
  useEffect(() => {
    if (cameraError) return

    const ctx = gsap.context(() => {
      if (overlayRef.current) {
        gsap.from(overlayRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' })
      }
      if (bottomRef.current) {
        gsap.from(bottomRef.current, { y: 60, opacity: 0, duration: 0.5, delay: 0.2, ease: 'power3.out' })
      }

      if (scanLineRef.current) {
        gsap.to(scanLineRef.current, {
          y: SCANNER_SIZE - 48,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      if (scannerBoxRef.current) {
        gsap.to(scannerBoxRef.current, {
          scale: 1.05,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

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
    <div className="flex-1 relative flex flex-col h-full bg-black">
      {/* Camera feed or error state */}
      {cameraError ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#fff]/10 flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.35 9.65V11.35C4.35 15.57 7.78 19 12 19C16.22 19 19.65 15.57 19.65 11.35V9.65" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 19V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-[#fff] text-2xl font-semibold text-center">Camera Access Required</h2>
          <p className="text-[#fff]/70 text-base text-center leading-relaxed max-w-sm">
            {cameraError}
          </p>
          {permissionDenied && (
            <button
              onClick={handleRequestPermission}
              className="bg-primary py-4 px-10 rounded-2xl mt-4 active:scale-95 transition-transform"
            >
              <span className="text-[#fff] font-semibold">Grant Camera Permission</span>
            </button>
          )}
          <button onClick={handleClose} className="p-3 mt-2 active:opacity-70 transition-opacity">
            <span className="text-[#fff]/60 text-sm">Go Back</span>
          </button>
        </div>
      ) : (
        <>
          {/* Camera video feed */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full bg-black h-full object-cover border-0 outline-none"
            style={{ border: 'none' }}
            playsInline
            muted
            autoPlay
          />

          {/* Hidden canvas for QR detection */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanner frame area - centered */}
          <div className="flex-1 relative z-10 flex items-start  justify-center">
            {/* Breathing wrapper */}
            <div
              ref={scannerBoxRef}
              className="p-5 bg-[#fff]/10 absolute left-1/2 -translate-x-1/2 top-[40%] -translate-y-1/2 rounded-3xl "
              style={{ willChange: 'transform' }}
            >
              <div className="relative" style={{ width: SCANNER_SIZE, height: SCANNER_SIZE }}>
                {/* Corner brackets */}
                <div
                  ref={cornerTLRef}
                  className="absolute top-0 left-0 border-t-4 border-l-4 border-[#fff] rounded-tl-[20px]"
                  style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
                />
                <div
                  ref={cornerTRRef}
                  className="absolute top-0 right-0 border-t-4 border-r-4 border-[#fff] rounded-tr-[20px]"
                  style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
                />
                <div
                  ref={cornerBLRef}
                  className="absolute bottom-0 left-0 border-b-4 border-l-4 border-[#fff] rounded-bl-[20px]"
                  style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
                />
                <div
                  ref={cornerBRRef}
                  className="absolute bottom-0 right-0 border-b-4 border-r-4 border-[#fff] rounded-br-[20px]"
                  style={{ width: CORNER_SIZE, height: CORNER_SIZE }}
                />

                {/* Scanning line */}
                <div
                  ref={scanLineRef}
                  className="absolute left-6 right-6 h-[3px] bg-[#fff] rounded-full top-6"
                  style={{ boxShadow: '0 0 12px rgba(255,255,255,1)', willChange: 'transform' }}
                />
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div ref={bottomRef} className="fixed w-full bottom-0 z-10">
            <div className="flex flex-col items-center pt-8 pb-[max(2rem,calc(env(safe-area-inset-bottom,0px)+2rem))]">
              <p className="text-[#fff]/90 text-[15px] font-medium text-center mb-8">
                Align QR code within the frame to scan
              </p>

              <div className="flex justify-center gap-16">
                {/* Gallery */}
                <button onClick={handleGalleryPress} className="flex flex-col items-center gap-3 group">
                  <div className="w-[60px] h-[60px] rounded-full bg-[#fff]/20 backdrop-blur-md flex items-center justify-center group-active:scale-90 transition-transform border border-[#fff]/10">
                    <Image src="/svg/gallery.svg" alt="Gallery" width={24} height={24} />
                  </div>
                  <span className="text-[#fff] text-[13px] font-medium">Gallery</span>
                </button>

                {/* Flash */}
                <button onClick={toggleFlash} className="flex flex-col items-center gap-3 group">
                  <div className={`w-[60px] h-[60px] rounded-full backdrop-blur-md flex items-center justify-center group-active:scale-90 transition-all duration-200 border ${flashOn ? 'bg-primary border-primary/50' : 'bg-[#fff]/20 border-[#fff]/10'}`}>
                    <Image
                      src={flashOn ? '/svg/thunder-on.svg' : '/svg/thunder-off.svg'}
                      alt="Flash"
                      width={16}
                      height={22}
                    />
                  </div>
                  <span className="text-[#fff] text-[13px] font-medium">
                    {flashOn ? 'Flash On' : 'Flash Off'}
                  </span>
                </button>
              </div>

              <div onClick={() => router.push(routes.makePayment)} className='p-2 text-white mt-6 bg-white/20 backdrop-blur-md flex items-center gap-8 pr-4 border border-border/20 rounded-full'>
                <div className='relative '>

                  <div className='w-10 h-10 rounded-full bg-green-500/80 backdrop-blur-xl flex items-center justify-center'>N</div>
                  <div className='w-10 h-10 top-1/2 -translate-y-1/2 left-[20%] z-2 absolute rounded-full bg-blue-500/80 backdrop-blur-xl flex items-center justify-center'>N</div>
                  <div className='w-10 h-10 absolute top-1/2 -translate-y-1/2 z-3 left-[40%] rounded-full bg-red-500/80 backdrop-blur-xl flex items-center justify-center'>N</div>
                </div>
                <p className='text-white text-xs font-medium'>Recents</p>
              </div>
            </div>

          </div>
          {isProcessing && (
            <div
              ref={processingOverlayRef}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(7px)' }}
            >
              <div className="flex flex-col items-center gap-4">
                {/* Animated spinner */}
                <div className="w-20 h-20 flex items-center justify-center">
                  <div className="animate-spin rounded-full border-8 border-primary border-t-transparent border-opacity-70 w-20 h-20" />
                  {/* use an svg tick or similar (optional for success, not animated) */}
                  {/* No checkmark draw animation */}
                </div>
                <p className="text-white text-xl font-semibold mt-2">Processing…</p>
                <p className="text-white/60 text-base tracking-wide">Validating and redirecting</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── QR Processing Overlay ── */}


      {/* ── Invalid QR Toaster ── */}
      <Toaster
        visible={!!qrError}
        message="Invalid QR Code"
        subtitle={qrError ?? undefined}
        onDismiss={() => { setQrError(null); hasScanned.current = false }}
        duration={3000}
      />
    </div>
  )
}
