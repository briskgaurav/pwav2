'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { runAllValidations, allValidationsPass } from '../components/Extras/utils/faceValidation';
import { calculateBrightness, calculateBlurVariance } from '../components/Extras/utils/imageProcessing';

export const useFaceDetection = (videoRef, isVideoReady) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [validations, setValidations] = useState(null);
  const [allPass, setAllPass] = useState(false);

  const faceapiRef = useRef(null);
  const intervalRef = useRef(null);
  const isRunningRef = useRef(false);

  // Load face-api.js and models
  const loadModels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Dynamically import face-api.js
      const faceapi = await import('face-api.js');
      faceapiRef.current = faceapi;

      // Load models from public folder
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);

      setIsReady(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load face detection models:', err);
      setError('Failed to load face detection. Please refresh the page.');
      setIsLoading(false);
    }
  }, []);

  // Detect faces in current frame
  const detectFaces = useCallback(async () => {
    if (!faceapiRef.current || !videoRef?.current || !isVideoReady || isRunningRef.current) {
      return;
    }

    isRunningRef.current = true;
    const faceapi = faceapiRef.current;
    const video = videoRef.current;

    try {
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5,
      });

      const detections = await faceapi
        .detectAllFaces(video, options)
        .withFaceLandmarks();

      const dimensions = {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      };

      const brightness = calculateBrightness(video);
      const blurVariance = calculateBlurVariance(video);

      const results = runAllValidations(detections, dimensions, brightness, blurVariance);
      setValidations(results);
      setAllPass(allValidationsPass(results));
    } catch (err) {
      console.error('Face detection error:', err);
    } finally {
      isRunningRef.current = false;
    }
  }, [videoRef, isVideoReady]);

  // Start detection loop
  const startDetection = useCallback(() => {
    if (intervalRef.current) return;

    // Run detection every 200ms (~5fps for validation checks)
    intervalRef.current = setInterval(() => {
      detectFaces();
    }, 200);

    // Run immediately
    detectFaces();
  }, [detectFaces]);

  // Stop detection loop
  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isRunningRef.current = false;
  }, []);

  // Load models on mount
  useEffect(() => {
    loadModels();

    return () => {
      stopDetection();
    };
  }, [loadModels, stopDetection]);

  // Start/stop detection based on video readiness
  useEffect(() => {
    if (isReady && isVideoReady) {
      startDetection();
    } else {
      stopDetection();
    }

    return () => {
      stopDetection();
    };
  }, [isReady, isVideoReady, startDetection, stopDetection]);

  return {
    isLoading,
    isReady,
    error,
    validations,
    allPass,
    startDetection,
    stopDetection,
  };
};
