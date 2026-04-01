'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useVerifyFlow } from './hooks/useVerifyFlow';
import { useVerifyProgress } from './VerifyProgressContext';
import { saveToSession } from './utils/imageProcessing';
import { SCREENS } from './constants';
import WelcomeScreen from './screens/WelcomeScreen';
import CameraScreen from './screens/CameraScreen';
import ReviewScreen from './screens/ReviewScreen';
import ProcessingScreen from './screens/ProcessingScreen';

export default function VerifyContainer() {
  const router = useRouter();
  const { setStep } = useVerifyProgress();

  // Face verification is step 1
  useEffect(() => {
    setStep(1);
  }, [setStep]);

  const handleComplete = (imageData) => {
    // Save image to session storage
    saveToSession(imageData);
    // Navigate to success page
    router.push('/verify/success');
  };

  const {
    currentScreen,
    capturedImage,
    goToCamera,
    goToReview,
    goToProcessing,
    goToComplete,
    retake,
    goBack,
  } = useVerifyFlow(handleComplete);

  const handleContinue = () => {
    goToProcessing();

    // Simulate processing delay (would be API call in production)
    setTimeout(() => {
      goToComplete();
    }, 2000);
  };

  switch (currentScreen) {
    case SCREENS.WELCOME:
      return <WelcomeScreen onStart={goToCamera} />;

    case SCREENS.CAMERA:
      return <CameraScreen onCapture={goToReview} onBack={goBack} />;

    case SCREENS.REVIEW:
      return (
        <ReviewScreen
          imageData={capturedImage}
          onRetake={retake}
          onContinue={handleContinue}
        />
      );

    case SCREENS.PROCESSING:
      return <ProcessingScreen />;

    // default:
    //   return <WelcomeScreen onStart={goToCamera} />;
  }
}
