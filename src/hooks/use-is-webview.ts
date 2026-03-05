'use client';

import { useEffect, useState } from 'react';

export function useIsWebView() {
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    const userAgent =
      navigator.userAgent ||
      (navigator as Navigator & { vendor?: string }).vendor ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).opera as string | undefined) ||
      '';

    const anyWindow = window as Window &
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { ReactNativeWebView?: any };

    const isWebViewUA =
      /wv/.test(userAgent) || // Android WebView
      /\(ip.*applewebkit(?!.*(version|crios|fxios|opios|mercury|ucbrowser|qqbrowser|baidubrowser))/i.test(
        userAgent
      ) || // iOS WebView
      /WebView/i.test(userAgent) || // Generic WebView indicators
      (window.matchMedia &&
        window.matchMedia('(display-mode: standalone)').matches) || // PWA standalone
      /ReactNative/i.test(userAgent) || // React Native WebView
      /Flutter/i.test(userAgent) || // Flutter WebView
      Boolean(anyWindow.ReactNativeWebView); // RN WebView bridge

    setIsWebView(isWebViewUA);
  }, []);

  return isWebView;
}

