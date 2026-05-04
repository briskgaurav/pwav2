'use client';

import { useEffect, useCallback, useState } from 'react';

import CameraView from '@/components/Extras/CameraView';
import FaceGuide from '@/components/Extras/FaceGuide';
import { captureImage, saveToSession } from '@/components/Extras/utils/imageProcessing';
import ValidationStatus from '@/components/Extras/ValidationStatus';
import ButtonComponent from '@/components/ui/ButtonComponent';
import { useCamera } from '@/hooks/useCamera';
import { useFaceDetection } from '@/hooks/useFaceDetection';

export default function FaceScan({ getButtonText, handleContinue }: { getButtonText: () => string, handleContinue: () => void }) {
  const {
    videoRef,
    fileInputRef,
    isReady: isCameraReady,
    isChecking,
    error: cameraError,
    startCamera,
    retryCamera,
    useFallback,
    capturedImage,
    handleFileCapture,
    triggerFileCapture,
    clearCapturedImage,
  } = useCamera();

  const {
    isLoading: isDetectionLoading,
    error: detectionError,
    validations,
    allPass,
  } = useFaceDetection(videoRef, isCameraReady && !useFallback);

  const [isCapturing, setIsCapturing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // All hooks must be called before any conditional returns
  const handleCapture = useCallback(() => {
    setIsCapturing(true);
    setIsVerifying(true);
    try {
      const videoEl = videoRef.current as HTMLVideoElement | null;
      if (videoEl && videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
        const imageData = captureImage(videoEl);
        saveToSession(imageData);
      }
    } catch (e) {
      console.error('Failed to capture face image:', e);
    }
    
    setTimeout(() => {
      setIsCapturing(false);
      setIsVerifying(false);
      handleContinue();
    }, 2000);
  }, [handleContinue, videoRef]);

  // Handle capture from fallback mode (file input)
  const handleFallbackCapture = useCallback(() => {
    if (capturedImage) {
      setIsCapturing(true);
      setIsVerifying(true);
      try {
        saveToSession(capturedImage);
      } catch (e) {
        console.error('Failed to save captured image:', e);
      }
      
      setTimeout(() => {
        setIsCapturing(false);
        setIsVerifying(false);
        handleContinue();
      }, 2000);
    }
  }, [capturedImage, handleContinue]);

  // Start camera on mount (after environment check completes)
  useEffect(() => {
    if (!isChecking) {
      startCamera();
    }
  }, [startCamera, isChecking]);

  // Show loading while checking environment
  if (isChecking) {
    return (
      <div className="h-full bg-black flex flex-col items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Preparing camera...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state (only show for non-fallback errors)
  if (cameraError && !useFallback) {
    return (
      <div className="h-fit bg-black flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-black mb-2">Camera Error</h2>
          <p className="text-gray-500 mb-6">{cameraError}</p>
          <button
            onClick={retryCamera}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Fallback mode - use file input with camera capture
  if (useFallback) {
    return (
      <div className="h-full bg-black relative overflow-hidden flex flex-col w-full">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileCapture}
          className="hidden"
        />

        <div className="relative h-full flex flex-col items-center justify-center">
          {capturedImage ? (
            // Show captured image preview
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              <FaceGuide isValid={true} />

              {/* Retake button */}
              <button
                onClick={clearCapturedImage}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-black"
              >
                Retake
              </button>
              
              {/* Verifying overlay */}
              {isVerifying && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                    <div className="flex items-center justify-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Stay Still Verifying...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show camera placeholder
            <div className="text-white text-center p-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-zinc-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Take a Selfie</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Tap the button below to open your camera and take a photo of your face
              </p>
            </div>
          )}
        </div>

        {/* Button */}
        <ButtonComponent
          title={isVerifying ? 'Verifying...' : (capturedImage ? getButtonText() : 'Open Camera')}
          onClick={capturedImage ? handleFallbackCapture : triggerFileCapture}
          disabled={isCapturing}
        />
      </div>
    );
  }

  // Normal mode - live camera stream
  return (
    <div className="h-full bg-black relative overflow-hidden flex flex-col w-full">
      {/* Camera view */}
      <div className="relative h-full">
        <CameraView ref={videoRef} />
        <FaceGuide isValid={allPass} />

        {/* Verifying overlay */}
        {isVerifying && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Verifying...</span>
              </div>
            </div>
          </div>
        )}

        {/* Validation status */}
        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2">
          <p className="text-white text-sm text-center">
            {allPass ? 'Ready to capture' : 'Position your face'}
          </p>
          {isDetectionLoading ? (
          <>
          <p className='text-white text-sm'>Loading</p>
          </>
          ) : !isCameraReady ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Starting camera...</span>
              </div>
            </div>
          ) : detectionError ? (
            <div className="bg-red-500/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="text-white text-sm">{detectionError}</span>
            </div>
          ) : (
            <ValidationStatus validations={validations} compact />
          )}
        </div>
      </div>

      {/* Continue Button */}
      <ButtonComponent title={isVerifying ? 'Verifying...' : getButtonText()} onClick={handleCapture} disabled={!allPass || isCapturing} />
    </div>
  );
}
