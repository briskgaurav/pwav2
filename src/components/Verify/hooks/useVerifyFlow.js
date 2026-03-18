'use client';

import { useState, useCallback } from 'react';
import { SCREENS } from '../constants';

export const useVerifyFlow = (onComplete) => {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.CAMERA);
  const [capturedImage, setCapturedImage] = useState(null);

  const goToCamera = useCallback(() => {
    setCurrentScreen(SCREENS.CAMERA);
  }, []);

  const goToReview = useCallback((imageData) => {
    setCapturedImage(imageData);
    setCurrentScreen(SCREENS.REVIEW);
  }, []);

  const goToProcessing = useCallback(() => {
    setCurrentScreen(SCREENS.PROCESSING);
  }, []);

  const goToComplete = useCallback(() => {
    setCurrentScreen(SCREENS.COMPLETE);
    if (onComplete) {
      onComplete(capturedImage);
    }
  }, [capturedImage, onComplete]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setCurrentScreen(SCREENS.CAMERA);
  }, []);

  const reset = useCallback(() => {
    setCapturedImage(null);
    setCurrentScreen(SCREENS.WELCOME);
  }, []);

  const goBack = useCallback(() => {
    switch (currentScreen) {
      case SCREENS.CAMERA:
        setCurrentScreen(SCREENS.WELCOME);
        break;
      case SCREENS.REVIEW:
        setCurrentScreen(SCREENS.CAMERA);
        setCapturedImage(null);
        break;
      default:
        break;
    }
  }, [currentScreen]);

  return {
    currentScreen,
    capturedImage,
    goToCamera,
    goToReview,
    goToProcessing,
    goToComplete,
    retake,
    reset,
    goBack,
  };
};
