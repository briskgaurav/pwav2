/**
 * Native Bridge Utility
 * Provides communication between the PWA and native app containers (Android/iOS WebViews)
 */

// Check if running in Android WebView
export const isAndroidWebView = () => {
  return typeof window !== 'undefined' && typeof window.AndroidBridge !== 'undefined';
};

// Check if running in iOS WKWebView
export const isIOSWebView = () => {
  return typeof window !== 'undefined' && typeof window.iOSBridge !== 'undefined';
};

// Check if running in any native WebView
export const isNativeWebView = () => {
  return isAndroidWebView() || isIOSWebView();
};

/**
 * Close the WebView and return to the host app
 * Falls back to window.close() or history.back() if not in a native WebView
 */
export const closeWebView = () => {
  if (typeof window === 'undefined') return false;

  // Try Android bridge
  if (window.AndroidBridge?.closeWebView) {
    window.AndroidBridge.closeWebView();
    return true;
  }

  // Try iOS bridge
  if (window.iOSBridge?.closeWebView) {
    window.iOSBridge.closeWebView();
    return true;
  }

  // Try webkit message handler directly (iOS fallback)
  if (window.webkit?.messageHandlers?.iOSBridge) {
    window.webkit.messageHandlers.iOSBridge.postMessage({ action: 'closeWebView' });
    return true;
  }

  // Fallback: try window.close() (works in some contexts)
  try {
    window.close();
    return true;
  } catch (e) {
    console.log('[NativeBridge] window.close() failed:', e);
  }

  // Final fallback: go back in history
  if (window.history.length > 1) {
    window.history.back();
    return true;
  }

  return false;
};

/**
 * Navigate back in WebView history, or close if at the beginning
 */
export const goBack = () => {
  if (typeof window === 'undefined') return false;

  // Try Android bridge
  if (window.AndroidBridge?.goBack) {
    window.AndroidBridge.goBack();
    return true;
  }

  // Try iOS bridge
  if (window.iOSBridge?.goBack) {
    window.iOSBridge.goBack();
    return true;
  }

  // Try webkit message handler directly (iOS fallback)
  if (window.webkit?.messageHandlers?.iOSBridge) {
    window.webkit.messageHandlers.iOSBridge.postMessage({ action: 'goBack' });
    return true;
  }

  // Fallback: use browser history
  if (window.history.length > 1) {
    window.history.back();
    return true;
  }

  return false;
};

/**
 * Get information about the current native environment
 */
export const getNativeEnvironment = () => {
  if (typeof window === 'undefined') {
    return { platform: 'server', isNative: false };
  }

  if (isAndroidWebView()) {
    return { platform: 'android', isNative: true };
  }

  if (isIOSWebView()) {
    return { platform: 'ios', isNative: true };
  }

  return { platform: 'web', isNative: false };
};

// TypeScript declarations for the bridges (for better IDE support)
// declare global {
//   interface Window {
//     AndroidBridge?: {
//       closeWebView: () => void;
//       goBack: () => void;
//     };
//     iOSBridge?: {
//       closeWebView: () => void;
//       goBack: () => void;
//     };
//   }
// }
