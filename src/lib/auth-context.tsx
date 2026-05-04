'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  parseSDKConfig,
  notifyReady,
  notifyError,
  type SDKConfig,
  isValidToken,
  getInitialLanguage,
  listenForLanguageChanges,
  getInitialTheme,
  listenForThemeChanges,
} from './bridge';
import i18n from './i18n';

interface AuthContextType {
  config: SDKConfig | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  language: string;
  theme: 'light' | 'dark';
  isDarkMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
  config: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  language: 'en',
  theme: 'light',
  isDarkMode: false,
});

function FallbackLoader() {
  return (
    <div className="flex items-center justify-center bg-white h-screen w-full">
      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ config, error, notify }] = useState(() => {
    const sdkConfig = parseSDKConfig();

    if (!sdkConfig) {
      if (process.env.NODE_ENV === 'development') {
        return {
          config: { userToken: 'dev-token', environment: 'development' } as SDKConfig,
          error: null as string | null,
          notify: { type: 'ready' as const },
        };
      }

      return {
        config: null as SDKConfig | null,
        error: 'Missing authentication token' as string,
        notify: { type: 'error' as const, code: 'AUTH_MISSING', message: 'No authentication token provided' },
      };
    }

    if (!isValidToken(sdkConfig.userToken)) {
      return {
        config: null as SDKConfig | null,
        error: 'Invalid or expired token' as string,
        notify: { type: 'error' as const, code: 'AUTH_INVALID', message: 'Authentication token is invalid or expired' },
      };
    }

    return {
      config: sdkConfig,
      error: null as string | null,
      notify: { type: 'ready' as const },
    };
  });

  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    const lang = getInitialLanguage();
    localStorage.setItem('lang', lang);
    console.log('[PWA] Initial language:', lang);
    return lang;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return getInitialTheme();
  });

  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  const isDarkMode = theme === 'dark';

  useEffect(() => {
    if (notify.type === 'ready') {
      notifyReady();
    } else {
      notifyError(notify.code, notify.message);
    }
  }, [notify]);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsLanguageLoaded(true);
    } else {
      i18n.on('initialized', () => {
        setIsLanguageLoaded(true);
      });
    }

    return listenForLanguageChanges((lang) => {
      i18n.changeLanguage(lang);
      setLanguage(lang);
    });
  }, []);

  // Apply text/layout direction based on current language (RTL for Arabic)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const langCode = language.split('-')[0] || 'en';
    const isRTL = langCode === 'ar';
    const dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [language]);

  useEffect(() => {
    return listenForThemeChanges((newTheme) => {
      setTheme(newTheme);
    });
  }, []);

  // Apply Tailwind dark mode class based on current theme
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (!isLanguageLoaded) {
    return <FallbackLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        config,
        isLoading: false,
        isAuthenticated: !!config && !error,
        error,
        language,
        theme,
        isDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
