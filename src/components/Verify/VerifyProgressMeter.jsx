'use client';

const VERIFY_STEPS = [
  'Face Verification',
  'OTP Verification',
  'Authorization',
  'Email Verification',
];

export default function VerifyProgressMeter({ currentStep = 1 }) {
  const clampedStep = Math.max(1, Math.min(VERIFY_STEPS.length, currentStep));

  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center gap-2">
        {VERIFY_STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < clampedStep;
          const isCurrent = stepNumber === clampedStep;

          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-1.5 w-full rounded-full ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                      ? 'bg-yellow-500'
                      : 'bg-gray-200'
                }`}
              />
              <span
                className={`text-[10px] font-medium truncate max-w-full ${
                  isCompleted
                    ? 'text-blue'
                    : isCurrent
                      ? 'text-yellow-500'
                      : 'text-gray-400'
                }`}
                title={label}
              >
                {label.length > 12 ? `${label.slice(0, 10)}...` : label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
