'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

import { CAMERA_CONSTRAINTS } from '../constants/cameraConstant';

// Detect if running in a WebView environment
const detectEnvironment = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { isWebView: false, supportsGetUserMedia: false, browser: 'unknown' };
  }

  const ua = navigator.userAgent || '';
  const uaLower = ua.toLowerCase();

  // Detect various WebView environments
  const isAndroidWebView = /wv/.test(ua) || // Android WebView marker
    (uaLower.includes('android') && !uaLower.includes('chrome/') && uaLower.includes('version/')); // Old Android WebView

  const isIOSWebView = /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(ua) || // iOS WebView (no Safari)
    /\bwkwebview\b/i.test(ua);

  // React Native WebView detection
  const isReactNativeWebView = typeof window.ReactNativeWebView !== 'undefined' ||
    uaLower.includes('reactnative');

  // Other WebView indicators
  const isFacebookWebView = /fban|fbav/i.test(ua);
  const isInstagramWebView = /instagram/i.test(ua);
  const isLinkedInWebView = /linkedinapp/i.test(ua);
  const isTwitterWebView = /twitter/i.test(ua);
  const isTikTokWebView = /tiktok/i.test(ua);
  const isSnapchatWebView = /snapchat/i.test(ua);

  // Check if it's a social media in-app browser (these usually don't support getUserMedia well)
  const isSocialMediaWebView = isFacebookWebView || isInstagramWebView ||
    isLinkedInWebView || isTwitterWebView || isTikTokWebView || isSnapchatWebView;

  // Determine browser
  let browser = 'unknown';
  if (uaLower.includes('chrome') && !uaLower.includes('edg')) browser = 'chrome';
  else if (uaLower.includes('safari') && !uaLower.includes('chrome')) browser = 'safari';
  else if (uaLower.includes('firefox')) browser = 'firefox';
  else if (uaLower.includes('edg')) browser = 'edge';

  const isWebView = isAndroidWebView || isIOSWebView || isReactNativeWebView || isSocialMediaWebView;

  // Check getUserMedia support
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  // Even if getUserMedia exists, it might not work in WebViews without proper host app configuration
  // We'll use a timeout-based approach to detect this
  const supportsGetUserMedia = hasGetUserMedia && !isSocialMediaWebView;

  console.log('[Camera] Environment detected:', {
    isWebView,
    isAndroidWebView,
    isIOSWebView,
    isReactNativeWebView,
    isSocialMediaWebView,
    browser,
    hasGetUserMedia,
    supportsGetUserMedia,
    userAgent: `${ua.substring(0, 100)  }...`
  });

  return {
    isWebView,
    isAndroidWebView,
    isIOSWebView,
    isReactNativeWebView,
    isSocialMediaWebView,
    browser,
    hasGetUserMedia,
    supportsGetUserMedia,
  };
};

// Test if getUserMedia actually works (with timeout)
const testGetUserMedia = async (timeoutMs = 5000) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { works: false, reason: 'not_available' };
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log('[Camera] getUserMedia timed out - likely unsupported WebView');
      resolve({ works: false, reason: 'timeout' });
    }, timeoutMs);

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        clearTimeout(timeout);
        // Stop the test stream immediately
        stream.getTracks().forEach(track => track.stop());
        console.log('[Camera] getUserMedia test successful');
        resolve({ works: true, reason: 'success' });
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.log('[Camera] getUserMedia test failed:', err.name, err.message);
        resolve({ works: false, reason: err.name, error: err });
      });
  });
};

export const useCamera = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt');
  const [useFallback, setUseFallback] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [environment, setEnvironment] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // Detect environment on mount
  useEffect(() => {
    const env = detectEnvironment();
    setEnvironment(env);

    // For social media WebViews, immediately use fallback
    if (env.isSocialMediaWebView) {
      console.log('[Camera] Social media WebView detected, using fallback');
      setUseFallback(true);
      setIsReady(true);
      setIsChecking(false);
    } else {
      setIsChecking(false);
    }
  }, []);

  // Function to attach stream to video element
  const attachStream = useCallback((stream) => {
    const video = videoRef.current;
    if (!video || !stream) return false;

    video.srcObject = stream;

    const handleCanPlay = () => {
      video.play()
        .then(() => {
          setIsReady(true);
          setPermissionState('granted');
        })
        .catch((err) => {
          console.error('[Camera] Video play error:', err);
          setIsReady(true);
          setPermissionState('granted');
        });
    };

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

      // If already in fallback mode (e.g., social media WebView), stay there
      if (useFallback) {
        setIsReady(true);
        return;
      }

      // Check if camera API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('[Camera] getUserMedia not available, using fallback mode');
        setUseFallback(true);
        setIsReady(true);
        return;
      }

      // For WebViews, use a timeout approach because getUserMedia might hang
      // if the host app doesn't implement permission handlers
      const env = environment || detectEnvironment();
      const useTimeout = env.isWebView;
      const TIMEOUT_MS = 8000; // 8 seconds timeout for WebViews

      let timeoutId;
      let resolved = false;

      const getUserMediaPromise = navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);

      if (useTimeout) {
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            if (!resolved) {
              console.log('[Camera] getUserMedia timed out in WebView, switching to fallback');
              reject(new Error('TIMEOUT'));
            }
          }, TIMEOUT_MS);
        });

        try {
          const stream = await Promise.race([getUserMediaPromise, timeoutPromise]);
          resolved = true;
          clearTimeout(timeoutId);
          streamRef.current = stream;

          if (!attachStream(stream)) {
            let attempts = 0;
            const maxAttempts = 20;
            const interval = setInterval(() => {
              attempts++;
              if (attachStream(stream) || attempts >= maxAttempts) {
                clearInterval(interval);
                if (attempts >= maxAttempts && !videoRef.current) {
                  console.log('[Camera] Failed to attach stream, using fallback');
                  stream.getTracks().forEach(track => track.stop());
                  setUseFallback(true);
                  setIsReady(true);
                }
              }
            }, 100);
          }
        } catch (err) {
          resolved = true;
          clearTimeout(timeoutId);
          throw err;
        }
      } else {
        // Non-WebView: just use getUserMedia directly
        const stream = await getUserMediaPromise;
        streamRef.current = stream;

        if (!attachStream(stream)) {
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
      }
    } catch (err) {
      console.error('[Camera] Camera error:', err.name, err.message);

      // Handle timeout or permission errors by switching to fallback
      if (err.message === 'TIMEOUT' ||
          err.name === 'NotAllowedError' ||
          err.name === 'PermissionDeniedError' ||
          err.name === 'NotSupportedError' ||
          err.name === 'AbortError' ||
          err.message?.includes('not supported') ||
          err.message?.includes('Permission denied')) {
        console.log('[Camera] Switching to fallback mode due to:', err.message || err.name);
        setUseFallback(true);
        setIsReady(true);
        setError(null);
        return;
      }

      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is in use by another application. Please close it and try again.');
      } else {
        // For any other error, try fallback
        console.log('[Camera] Unknown error, trying fallback mode:', err);
        setUseFallback(true);
        setIsReady(true);
        setError(null);
        return;
      }

      setIsReady(false);
    }
  }, [attachStream, useFallback, environment]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
    setCapturedImage(null);
  }, []);

  const retryCamera = useCallback(() => {
    stopCamera();
    setUseFallback(false);
    setCapturedImage(null);
    startCamera();
  }, [stopCamera, startCamera]);

  // Force fallback mode (useful for testing or user preference)
  const forceFallback = useCallback(() => {
    stopCamera();
    setUseFallback(true);
    setIsReady(true);
    setError(null);
  }, [stopCamera]);

  // Handle file input for fallback mode
  const handleFileCapture = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result;
      setCapturedImage(imageData);
    };
    reader.onerror = () => {
      setError('Failed to read captured image');
    };
    reader.readAsDataURL(file);
  }, []);

  // Trigger file input click for fallback mode
  const triggerFileCapture = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Clear captured image (for retake in fallback mode)
  const clearCapturedImage = useCallback(() => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    fileInputRef,
    isReady,
    isChecking,
    error,
    permissionState,
    useFallback,
    capturedImage,
    environment,
    startCamera,
    stopCamera,
    retryCamera,
    forceFallback,
    handleFileCapture,
    triggerFileCapture,
    clearCapturedImage,
  };
};
