'use client';

export default function ProcessingScreen({ message = 'Verifying your identity...' }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Spinner */}
      <div className="relative w-24 h-24 mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-black animate-spin" />
        {/* Center icon */}
        <div className="absolute inset-4 bg-gray-50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold text-black mb-2">{message}</h2>
      <p className="text-gray-500 text-center max-w-xs">
        Please wait while we process your photo. This usually takes just a few seconds.
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-8">
        <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
