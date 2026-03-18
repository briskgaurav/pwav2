'use client';

import { useEffect, useCallback, useState } from 'react';
import { useCamera } from '../hooks/useCamera';
import CameraView from '../components/CameraView';
import FaceGuide from '../components/FaceGuide';
import ValidationStatus from '../components/ValidationStatus';
import CaptureButton from '../components/CaptureButton';
import VerifyButton from '../components/VerifyButton';
import { captureImage } from '../utils/imageProcessing';
import { useFaceDetection } from '../hooks/useFaceDetection';

export default function CameraScreen({ onCapture, onBack }) {
  const {
    videoRef,
    isReady: isCameraReady,
    error: cameraError,
    startCamera,
    retryCamera,
  } = useCamera();

  const {
    isLoading: isDetectionLoading,
    error: detectionError,
    validations,
    allPass,
  } = useFaceDetection(videoRef, isCameraReady);
 
  const [isCapturing, setIsCapturing] = useState(false);

  // Start camera on mount
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !allPass) return;

    setIsCapturing(true);

    // Small delay for visual feedback
    setTimeout(() => {
      const imageData = captureImage(videoRef.current);
      setIsCapturing(false);
      onCapture(imageData);
    }, 200);
  }, [videoRef, allPass, onCapture]);

  // Error state
  if (cameraError) {
    return (
      <div className="h-fit  bg-black flex flex-col items-center justify-center p-6">
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
          <div className="space-y-3">
            <VerifyButton onClick={retryCamera} fullWidth>
              Try Again
            </VerifyButton>
            <VerifyButton onClick={onBack} variant="secondary" fullWidth>
              Go Back
            </VerifyButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-fit bg-black overflow-hidden flex flex-col ">
      {/* Camera view */}
      <div className="relative min-h-[60vh]">
        <CameraView ref={videoRef} />
        <FaceGuide isValid={allPass} />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
          aria-label="Go back"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Validation status */}
        <div className="absolute top-[90%] left-1/2 -translate-x-1/2 z-10">
          {isDetectionLoading ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Loading...</span>
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

      {/* Controls */}
        <div className=" bg-black/80 backdrop-blur-sm mb-[30%] pt-6">
        <div className="flex flex-col items-center">
          <CaptureButton
            onClick={handleCapture}
            disabled={!allPass || isCapturing}
            isCapturing={isCapturing}
          />
          <p className="text-white/60 text-sm mt-4">
            {allPass ? 'Tap to capture' : 'Position your face in the frame'}
          </p>
        </div>
      </div>
    </div>
  );
}
