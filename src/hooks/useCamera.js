'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { CAMERA_CONSTRAINTS } from '../constants/cameraConstant';

export const useCamera = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt' | 'granted' | 'denied'

  // Function to attach stream to video element
  const attachStream = useCallback((stream) => {
    const video = videoRef.current;
    if (!video || !stream) return false;

    video.srcObject = stream;

    // Handle both cases: metadata not yet loaded OR already loaded
    const handleCanPlay = () => {
      video.play()
        .then(() => {
          setIsReady(true);
          setPermissionState('granted');
        })
        .catch((err) => {
          console.error('Video play error:', err);
          // On iOS, autoplay might be blocked - still mark as ready
          setIsReady(true);
          setPermissionState('granted');
        });
    };

    // If video is already ready, play immediately
    if (video.readyState >= 2) {
      handleCanPlay();
    } else {
      video.onloadeddata = handleCanPlay;
    }

    return true;
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // Check if camera API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      streamRef.current = stream;

      // Try to attach immediately
      if (!attachStream(stream)) {
        // If video element not ready, retry with polling
        let attempts = 0;
        const maxAttempts = 20;
        const interval = setInterval(() => {
          attempts++;
          if (attachStream(stream) || attempts >= maxAttempts) {
            clearInterval(interval);
            if (attempts >= maxAttempts && !videoRef.current) {
              setError('Failed to initialize camera view');
            }
          }
        }, 100);
      }
    } catch (err) {
      console.error('Camera error:', err);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access denied. Please allow camera access and try again.');
        setPermissionState('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is in use by another application. Please close it and try again.');
      } else {
        setError(err.message || 'Failed to start camera');
      }

      setIsReady(false);
    }
  }, [attachStream]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
  }, []);

  const retryCamera = useCallback(() => {
    stopCamera();
    startCamera();
  }, [stopCamera, startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isReady,
    error,
    permissionState,
    startCamera,
    stopCamera,
    retryCamera,
  };
};
