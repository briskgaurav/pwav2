'use client';

import { VALIDATION_MESSAGES } from '../constants';

const StatusIcon = ({ status }) => {
  if (status === 'pass') {
    return (
      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (status === 'fail') {
    return (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  // checking
  return (
    <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

const ValidationItem = ({ label, validation, messages }) => {
  const getMessage = () => {
    if (!validation) return messages.checking;
    return messages[validation.message] || messages.checking;
  };

  const getStatusColor = () => {
    if (!validation) return 'text-gray-400';
    if (validation.status === 'pass') return 'text-green-500';
    if (validation.status === 'fail') return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <StatusIcon status={validation?.status || 'checking'} />
      <span className={getStatusColor()}>{getMessage()}</span>
    </div>
  );
};

export default function ValidationStatus({ validations, compact = false }) {
  if (!validations) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Initializing face detection...</span>
        </div>
      </div>
    );
  }

  if (compact) {
    // Show only failing validations
    const failingValidations = Object.entries(validations).filter(
      ([, v]) => v.status === 'fail'
    );

    if (failingValidations.length === 0) {
      return (
        <div className="bg-green-500/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Ready to capture</span>
          </div>
        </div>
      );
    }

    const [key, validation] = failingValidations[0];
    const messages = VALIDATION_MESSAGES[key];

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
        <ValidationItem
          label={key}
          validation={validation}
          messages={messages}
        />
      </div>
    );
  }

  // Full validation list
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg space-y-2">
      <ValidationItem
        label="Face Detection"
        validation={validations.singleFace}
        messages={VALIDATION_MESSAGES.singleFace}
      />
      <ValidationItem
        label="Centered"
        validation={validations.centered}
        messages={VALIDATION_MESSAGES.centered}
      />
      <ValidationItem
        label="Distance"
        validation={validations.faceSize}
        messages={VALIDATION_MESSAGES.faceSize}
      />
      <ValidationItem
        label="Obstruction"
        validation={validations.obstruction}
        messages={VALIDATION_MESSAGES.obstruction}
      />
      <ValidationItem
        label="Lighting"
        validation={validations.lighting}
        messages={VALIDATION_MESSAGES.lighting}
      />
      <ValidationItem
        label="Facing Forward"
        validation={validations.faceAngle}
        messages={VALIDATION_MESSAGES.faceAngle}
      />
    </div>
  );
}
