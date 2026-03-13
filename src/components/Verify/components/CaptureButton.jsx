'use client';

export default function CaptureButton({ onClick, disabled = false, isCapturing = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isCapturing}
      className={`
        relative w-20 h-20 rounded-full
        transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-white/50
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
      `}
      aria-label="Capture photo"
    >
      {/* Outer ring */}
      <div
        className={`
          absolute inset-0 rounded-full border-4
          transition-colors duration-300
          ${disabled ? 'border-gray-400' : 'border-white'}
        `}
      />

      {/* Inner button */}
      <div
        className={`
          absolute inset-2 rounded-full
          transition-all duration-300
          ${isCapturing ? 'scale-90 bg-red-500' : disabled ? 'bg-gray-400' : 'bg-white hover:bg-gray-100'}
        `}
      />

      {/* Capture animation */}
      {isCapturing && (
        <div className="absolute inset-0 rounded-full border-4 border-white animate-ping" />
      )}
    </button>
  );
}
