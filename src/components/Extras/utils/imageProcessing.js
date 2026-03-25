/**
 * Capture image from video element
 * @param {HTMLVideoElement} videoEl - Video element to capture from
 * @param {number} quality - JPEG quality (0-1)
 * @returns {string} Base64 encoded image
 */
export const captureImage = (videoEl, quality = 0.92) => {
  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;

  const ctx = canvas.getContext('2d');

  // Flip horizontally for mirror effect
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(videoEl, 0, 0);

  return canvas.toDataURL('image/jpeg', quality);
};

/**
 * Calculate image brightness
 * @param {HTMLVideoElement} videoEl - Video element
 * @returns {number} Average brightness (0-255)
 */
export const calculateBrightness = (videoEl) => {
  const canvas = document.createElement('canvas');
  const size = 100; // Sample size for performance
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoEl, 0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    // Luminance formula
    sum += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
  }

  return sum / (size * size);
};

/**
 * Calculate Laplacian variance for blur detection
 * @param {HTMLVideoElement} videoEl - Video element
 * @returns {number} Variance value (higher = sharper)
 */
export const calculateBlurVariance = (videoEl) => {
  const canvas = document.createElement('canvas');
  const size = 100;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoEl, 0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  // Convert to grayscale
  const gray = [];
  for (let i = 0; i < data.length; i += 4) {
    gray.push(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
  }

  // Laplacian kernel
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const idx = y * size + x;
      const laplacian =
        -gray[idx - size] -
        gray[idx - 1] +
        4 * gray[idx] -
        gray[idx + 1] -
        gray[idx + size];

      sum += laplacian;
      sumSq += laplacian * laplacian;
      count++;
    }
  }

  const mean = sum / count;
  const variance = (sumSq / count) - (mean * mean);

  return variance;
};

/**
 * Save image to sessionStorage
 * @param {string} imageData - Base64 encoded image
 */
export const saveToSession = (imageData) => {
  try {
    sessionStorage.setItem('verify_captured_image', imageData);
  } catch (e) {
    console.error('Failed to save image to session storage:', e);
  }
};

/**
 * Get image from sessionStorage
 * @returns {string|null} Base64 encoded image or null
 */
export const getFromSession = () => {
  try {
    return sessionStorage.getItem('verify_captured_image');
  } catch (e) {
    console.error('Failed to get image from session storage:', e);
    return null;
  }
};

/**
 * Clear image from sessionStorage
 */
export const clearFromSession = () => {
  try {
    sessionStorage.removeItem('verify_captured_image');
  } catch (e) {
    console.error('Failed to clear image from session storage:', e);
  }
};
