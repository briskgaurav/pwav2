'use client';

import VerifyButton from '../components/VerifyButton';

export default function ReviewScreen({ imageData, onRetake, onContinue }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 flex items-center justify-between">
        <button
          onClick={onRetake}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          aria-label="Go back"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-black">Review Photo</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Photo preview */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
        <div className="relative w-full max-w-sm aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageData}
            alt="Captured photo"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Quality badge */}
          <div className="absolute top-4 left-4 bg-green-500 rounded-full px-3 py-1 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white text-sm font-medium">Good quality</span>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Make sure your face is clear and well-lit
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 p-6 pb-8 space-y-3">
        <VerifyButton onClick={onContinue} fullWidth size="lg">
          Looks Good
        </VerifyButton>
        <VerifyButton onClick={onRetake} variant="secondary" fullWidth size="lg">
          Retake Photo
        </VerifyButton>
      </div>
    </div>
  );
}
