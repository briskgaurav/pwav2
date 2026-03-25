import { VALIDATION_THRESHOLDS, FACE_GUIDE } from '../../../constants/cameraConstant';

/**
 * Check if exactly one face is detected
 * @param {Array} detections - face-api detections
 * @returns {{ status: string, message: string }}
 */
export const checkSingleFace = (detections) => {
  if (!detections || detections.length === 0) {
    return { status: 'fail', message: 'fail_none' };
  }
  if (detections.length > 1) {
    return { status: 'fail', message: 'fail_multiple' };
  }
  return { status: 'pass', message: 'pass' };
};

/**
 * Check if face is centered within the guide
 * @param {Object} detection - face-api detection with box
 * @param {Object} dimensions - { videoWidth, videoHeight }
 * @returns {{ status: string, message: string }}
 */
export const checkCentered = (detection, dimensions) => {
  if (!detection?.detection?.box) {
    return { status: 'fail', message: 'fail' };
  }

  const box = detection.detection.box;
  const faceCenterX = box.x + box.width / 2;
  const faceCenterY = box.y + box.height / 2;

  const viewCenterX = dimensions.videoWidth / 2;
  const viewCenterY = dimensions.videoHeight / 2;

  const toleranceX = dimensions.videoWidth * VALIDATION_THRESHOLDS.CENTER_TOLERANCE;
  const toleranceY = dimensions.videoHeight * VALIDATION_THRESHOLDS.CENTER_TOLERANCE;

  const offsetX = Math.abs(faceCenterX - viewCenterX);
  const offsetY = Math.abs(faceCenterY - viewCenterY);

  if (offsetX <= toleranceX && offsetY <= toleranceY) {
    return { status: 'pass', message: 'pass' };
  }
  return { status: 'fail', message: 'fail' };
};

/**
 * Check if face size is appropriate
 * @param {Object} detection - face-api detection with box
 * @param {Object} dimensions - { videoWidth, videoHeight }
 * @returns {{ status: string, message: string }}
 */
export const checkFaceSize = (detection, dimensions) => {
  if (!detection?.detection?.box) {
    return { status: 'fail', message: 'fail_far' };
  }

  const box = detection.detection.box;
  const guideWidth = dimensions.videoWidth * FACE_GUIDE.WIDTH;
  const guideHeight = dimensions.videoHeight * FACE_GUIDE.HEIGHT;
  const guideArea = guideWidth * guideHeight;

  const faceArea = box.width * box.height;
  const ratio = faceArea / guideArea;

  if (ratio < VALIDATION_THRESHOLDS.MIN_FACE_SIZE) {
    return { status: 'fail', message: 'fail_far' };
  }
  if (ratio > VALIDATION_THRESHOLDS.MAX_FACE_SIZE) {
    return { status: 'fail', message: 'fail_close' };
  }
  return { status: 'pass', message: 'pass' };
};

/**
 * Check if face is obstructed (hand covering, mask, glasses, etc.)
 * Uses detection confidence score and basic landmark sanity checks
 * @param {Object} detection - face-api detection with landmarks
 * @returns {{ status: string, message: string }}
 */
export const checkObstruction = (detection) => {
  if (!detection?.landmarks || !detection?.detection) {
    return { status: 'fail', message: 'fail_general' };
  }

  const score = detection.detection.score || 0;
  const box = detection.detection.box;
  const landmarks = detection.landmarks;

  // Low confidence score often indicates partial obstruction
  if (score < VALIDATION_THRESHOLDS.OBSTRUCTION_CONFIDENCE) {
    return { status: 'fail', message: 'fail_general' };
  }

  // Get key landmarks
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const nose = landmarks.getNose();
  const mouth = landmarks.getMouth();

  // Basic check: all landmark groups should exist
  if (!leftEye.length || !rightEye.length || !nose.length || !mouth.length) {
    return { status: 'fail', message: 'fail_general' };
  }

  // Check eyes are roughly at same height (not distorted)
  const leftEyeY = leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length;
  const rightEyeY = rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length;
  const eyeYDiff = Math.abs(leftEyeY - rightEyeY);
  if (eyeYDiff > box.height * 0.15) {
    return { status: 'fail', message: 'fail_eyes' };
  }

  // Check nose tip is between eyes and mouth vertically
  const noseTip = nose[nose.length - 1];
  const mouthCenter = mouth[Math.floor(mouth.length / 2)];
  const eyeCenterY = (leftEyeY + rightEyeY) / 2;

  if (noseTip && mouthCenter) {
    // Nose should be below eyes
    if (noseTip.y < eyeCenterY) {
      return { status: 'fail', message: 'fail_nose' };
    }
    // Mouth should be below nose
    if (mouthCenter.y < noseTip.y) {
      return { status: 'fail', message: 'fail_mouth' };
    }
  }

  return { status: 'pass', message: 'pass' };
};

/**
 * Check if eyes are open using eye aspect ratio
 * @param {Object} detection - face-api detection with landmarks
 * @returns {{ status: string, message: string }}
 */
export const checkEyesOpen = (detection) => {
  if (!detection?.landmarks) {
    return { status: 'fail', message: 'fail' };
  }

  const landmarks = detection.landmarks;
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  const calculateEAR = (eye) => {
    if (eye.length < 6) return 0;

    // Eye aspect ratio calculation
    const height1 = Math.sqrt(
      Math.pow(eye[1].x - eye[5].x, 2) +
      Math.pow(eye[1].y - eye[5].y, 2)
    );
    const height2 = Math.sqrt(
      Math.pow(eye[2].x - eye[4].x, 2) +
      Math.pow(eye[2].y - eye[4].y, 2)
    );
    const width = Math.sqrt(
      Math.pow(eye[0].x - eye[3].x, 2) +
      Math.pow(eye[0].y - eye[3].y, 2)
    );

    return (height1 + height2) / (2 * width);
  };

  const leftEAR = calculateEAR(leftEye);
  const rightEAR = calculateEAR(rightEye);
  const avgEAR = (leftEAR + rightEAR) / 2;

  if (avgEAR >= VALIDATION_THRESHOLDS.MIN_EYE_ASPECT_RATIO) {
    return { status: 'pass', message: 'pass' };
  }
  return { status: 'fail', message: 'fail' };
};

/**
 * Check lighting conditions
 * @param {number} brightness - Average brightness (0-255)
 * @returns {{ status: string, message: string }}
 */
export const checkLighting = (brightness) => {
  if (brightness < VALIDATION_THRESHOLDS.MIN_BRIGHTNESS) {
    return { status: 'fail', message: 'fail_dark' };
  }
  if (brightness > VALIDATION_THRESHOLDS.MAX_BRIGHTNESS) {
    return { status: 'fail', message: 'fail_bright' };
  }
  return { status: 'pass', message: 'pass' };
};

/**
 * Check blur level
 * @param {number} variance - Laplacian variance
 * @returns {{ status: string, message: string }}
 */
export const checkBlur = (variance) => {
  if (variance >= VALIDATION_THRESHOLDS.MIN_BLUR_VARIANCE) {
    return { status: 'pass', message: 'pass' };
  }
  return { status: 'fail', message: 'fail' };
};

/**
 * Check face angle (yaw and pitch)
 * @param {Object} detection - face-api detection with landmarks
 * @returns {{ status: string, message: string }}
 */
export const checkFaceAngle = (detection) => {
  if (!detection?.landmarks) {
    return { status: 'fail', message: 'fail' };
  }

  const landmarks = detection.landmarks;
  const nose = landmarks.getNose();
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  if (nose.length === 0 || leftEye.length === 0 || rightEye.length === 0) {
    return { status: 'fail', message: 'fail' };
  }

  // Calculate eye center
  const leftEyeCenter = {
    x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
    y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length
  };
  const rightEyeCenter = {
    x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
    y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length
  };

  // Calculate yaw based on nose position relative to eyes
  const eyeMidpoint = (leftEyeCenter.x + rightEyeCenter.x) / 2;
  const noseTip = nose[nose.length - 1];
  const eyeWidth = Math.abs(rightEyeCenter.x - leftEyeCenter.x);

  const yawOffset = Math.abs(noseTip.x - eyeMidpoint) / eyeWidth;
  const estimatedYaw = yawOffset * 45; // Rough estimation

  // Calculate pitch based on nose position relative to face height
  const box = detection.detection.box;
  const faceHeight = box.height;
  const noseCenterY = nose[3]?.y || noseTip.y;
  const expectedNoseY = box.y + faceHeight * 0.6;
  const pitchOffset = Math.abs(noseCenterY - expectedNoseY) / faceHeight;
  const estimatedPitch = pitchOffset * 45;

  if (estimatedYaw <= VALIDATION_THRESHOLDS.MAX_YAW &&
      estimatedPitch <= VALIDATION_THRESHOLDS.MAX_PITCH) {
    return { status: 'pass', message: 'pass' };
  }
  return { status: 'fail', message: 'fail' };
};

/**
 * Run all validations
 * @param {Array} detections - face-api detections
 * @param {Object} dimensions - { videoWidth, videoHeight }
 * @param {number} brightness - Average brightness
 * @param {number} blurVariance - Laplacian variance
 * @returns {Object} All validation results
 */
export const runAllValidations = (detections, dimensions, brightness, blurVariance) => {
  const singleFaceResult = checkSingleFace(detections);
  const detection = detections?.[0];

  return {
    singleFace: singleFaceResult,
    centered: singleFaceResult.status === 'pass'
      ? checkCentered(detection, dimensions)
      : { status: 'checking', message: 'checking' },
    faceSize: singleFaceResult.status === 'pass'
      ? checkFaceSize(detection, dimensions)
      : { status: 'checking', message: 'checking' },
    obstruction: singleFaceResult.status === 'pass'
      ? checkObstruction(detection)
      : { status: 'checking', message: 'checking' },
    eyesOpen: singleFaceResult.status === 'pass'
      ? checkEyesOpen(detection)
      : { status: 'checking', message: 'checking' },
    lighting: checkLighting(brightness),
    blur: checkBlur(blurVariance),
    faceAngle: singleFaceResult.status === 'pass'
      ? checkFaceAngle(detection)
      : { status: 'checking', message: 'checking' },
  };
};

/**
 * Check if all validations pass
 * @param {Object} validations - Validation results
 * @returns {boolean}
 */
export const allValidationsPass = (validations) => {
  return Object.values(validations).every(v => v.status === 'pass');
};
