'use client';

import { useEffect, useCallback, useState } from 'react';
import { useCamera } from '@/components/Verify/hooks/useCamera';
import CameraView from '@/components/Verify/components/CameraView';
import FaceGuide from '@/components/Verify/components/FaceGuide';
import ValidationStatus from '@/components/Verify/components/ValidationStatus';
import { useFaceDetection } from '@/components/Verify/hooks/useFaceDetection';
import ButtonComponent from '../../components/ui/ButtonComponent';

export default function FaceScan({ getButtonText, handleContinue }: { getButtonText: () => string, handleContinue: () => void }) {
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

  // Start camera on mount
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  // Error state
  if (cameraError) {
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

  return (
    <div className="h-full bg-black relative overflow-hidden flex flex-col w-full">
      {/* Camera view */}
      <div className="relative h-full">
        <CameraView ref={videoRef} />
        <FaceGuide isValid={allPass} />

        {/* Validation status */}
        <div className="absolute top-[5%] left-1/2 space-y-2 -translate-x-1/2 z-10">
          <p className="text-white  text-sm text-center">
            {allPass ? 'Ready to capture' : 'Position your face in the frame'}
          </p>
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

        {/* Continue Button */}
        <ButtonComponent title={getButtonText()} onClick={handleContinue} />

      {/* Instructions */}

    </div>
  );
}
