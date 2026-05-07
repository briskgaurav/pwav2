'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import Image from 'next/image'
import { routes } from '@/lib/routes'
import { useBackRedirect } from '@/hooks/useBackRedirect'
import { useAppDispatch } from '@/store/redux/hooks'
import { showToast } from '@/store/redux/slices/toasterSlice'
import { parseQRData } from '@/lib/parse-qr'

const SCANNER_WIDTH = 320
const SCANNER_HEIGHT = 200
const CORNER_SIZE = 40

export default function UcScanScreen() {
  const router = useRouter()
  const dispatch = useAppDispatch()
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
  const [isProcessing, setIsProcessing] = useState(false)
  const processingOverlayRef = useRef<HTMLDivElement>(null)

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
    dispatch(showToast({
      message: 'Invalid QR Code',
      subtitle: msg,
      tosterType: 'error',
      duration: 3000
    }))
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100])
  }, [dispatch])

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

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
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
          y: SCANNER_HEIGHT - 48,
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
              <div className="relative" style={{ width: SCANNER_WIDTH, height: SCANNER_HEIGHT }}>
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
                  className="absolute left-6 right-6 h-[2px] bg-primary rounded-full top-6"
                  style={{ boxShadow: '0 0 12px var(--color-primary)', willChange: 'transform' }}
                />
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div ref={bottomRef} className="fixed w-full bottom-0 z-10">
            <div className="flex flex-col items-center pt-8 pb-[max(2rem,calc(env(safe-area-inset-bottom,0px)+2rem))]">
              <p className="text-[#fff]/90 text-[15px] font-medium text-center mb-8">
                Align Universal Card within the frame to scan
              </p>

              <div className="flex flex-col w-full px-6 gap-4">
                <button 
                  onClick={() =>{router.push(routes.addUniversalVerifyMobile)}}
                  className="w-full bg-primary py-4 rounded-full active:scale-[0.98] transition-transform flex items-center justify-center"
                >
                  <span className="text-white font-semibold text-base">Continue</span>
                </button>
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


      {/* ── QR Processing Overlay ── */}
    </div>
  )
}
