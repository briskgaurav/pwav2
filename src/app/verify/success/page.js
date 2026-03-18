'use client';

import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyProgress } from '@/components/Verify/VerifyProgressContext';
import { routes } from '@/lib/routes';
import { getFromSession, clearFromSession } from '@/components/Verify/utils/imageProcessing';

export default function VerifySuccessPage() {
  const router = useRouter();
  const { setStep } = useVerifyProgress();

  // Face verification complete - show step 2 (OTP) as current
  useEffect(() => {
    setStep(2);
  }, [setStep]);

  // Get image from session storage on initial render
  const capturedImage = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return getFromSession();
  }, []);

  const handleDone = () => {
    clearFromSession();
    router.push(routes.registrationVerificationMethod);
  };

  const handleVerifyAgain = () => {
    clearFromSession();
    router.push('/verify');
  };

  return (
    <div className="min-h-[85vh] bg-white flex flex-col">
      {/* Content */}
      <div className="flex-1 flex pt-6 flex-col items-center  px-6">
        {/* Success animation */}
        <div className="relative w-12 h-12 mb-8">
          {/* Circle */}
          <div className="absolute inset-0 bg-green-100 rounded-full" />
          {/* Check icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-black mb-3 text-center">
          Verification Complete
        </h1>
        <p className="text-gray-500 text-center max-w-xs mb-8">
          Your identity has been successfully verified. You can now continue with your account.
        </p>

        {/* Captured image preview (optional) */}
        {capturedImage && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-100 mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={capturedImage}
              alt="Verified photo"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Verification details */}
        <div className="w-full max-w-xs bg-gray-50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Status</span>
            <span className="text-green-500 text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Verified
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Confidence</span>
            <span className="text-black text-sm font-medium">95%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Timestamp</span>
            <span className="text-black text-sm font-medium">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className=" p-6 pb-16 space-y-3">
        <button
          onClick={handleDone}
          className="w-full bg-black text-white font-medium py-4 px-6 rounded-full hover:bg-gray-800 transition-colors"
        >
          Done
        </button>
        <button
          onClick={handleVerifyAgain}
          className="w-full bg-gray-100 text-black font-medium py-4 px-6 rounded-full hover:bg-gray-200 transition-colors"
        >
          Verify Again
        </button>
      </div>
    </div>
  );
}
