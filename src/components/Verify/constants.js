// Validation thresholds
export const VALIDATION_THRESHOLDS = {
  // Face detection
  DETECTION_SCORE: 0.5,

  // Obstruction detection (lower = more strict)
  OBSTRUCTION_CONFIDENCE: 0.65,

  // Face centering (percentage from center)
  CENTER_TOLERANCE: 0.15,

  // Face size as percentage of guide area
  MIN_FACE_SIZE: 0.4,
  MAX_FACE_SIZE: 0.8,

  // Face angle limits (degrees)
  MAX_YAW: 15,
  MAX_PITCH: 15,

  // Eye aspect ratio for open eyes
  MIN_EYE_ASPECT_RATIO: 0.2,

  // Lighting (0-255 brightness)
  MIN_BRIGHTNESS: 50,
  MAX_BRIGHTNESS: 200,

  // Blur detection (Laplacian variance)
  MIN_BLUR_VARIANCE: 100,
};

// Validation messages
export const VALIDATION_MESSAGES = {
  singleFace: {
    checking: 'Looking for face...',
    pass: 'Face detected',
    fail_none: 'Show your face clearly',
    fail_multiple: 'Only one face allowed',
  },
  centered: {
    checking: 'Checking position...',
    pass: 'Face centered',
    fail: 'Move face to center',
  },
  faceSize: {
    checking: 'Checking distance...',
    pass: 'Good distance',
    fail_close: 'Move farther away',
    fail_far: 'Move closer',
  },
  obstruction: {
    checking: 'Checking visibility...',
    pass: 'Face clear',
    fail_eyes: 'Remove glasses or obstruction from eyes',
    fail_mouth: 'Remove mask or obstruction from mouth',
    fail_nose: 'Remove obstruction from nose',
    fail_general: 'Remove hand or obstruction from face',
    fail: 'Face partially covered',
  },
  eyesOpen: {
    checking: 'Checking eyes...',
    pass: 'Eyes open',
    fail: 'Please open your eyes',
  },
  lighting: {
    checking: 'Checking lighting...',
    pass: 'Good lighting',
    fail_dark: 'Too dark, add more light',
    fail_bright: 'Too bright, reduce lighting',
  },
  blur: {
    checking: 'Checking clarity...',
    pass: 'Image clear',
    fail: 'Image blurry, hold steady',
  },
  faceAngle: {
    checking: 'Checking angle...',
    pass: 'Facing forward',
    fail: 'Please face the camera',
  },
};

// Screen states
export const SCREENS = {
  WELCOME: 'welcome',
  CAMERA: 'camera',
  REVIEW: 'review',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
};

// Camera settings
export const CAMERA_CONSTRAINTS = {
  video: {
    facingMode: 'user',
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
  audio: false,
};

// Face guide dimensions (percentage of viewport)
export const FACE_GUIDE = {
  WIDTH: 0.7,   // 70% of container width
  HEIGHT: 0.6,  // 60% of container height
  ASPECT_RATIO: 0.75, // oval aspect ratio
};
