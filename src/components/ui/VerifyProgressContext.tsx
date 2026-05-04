'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface VerifyProgressContextType {
  currentStep: number;
  setStep: (step: number) => void;
}

const VerifyProgressContext = createContext<VerifyProgressContextType | null>(null);

interface VerifyProgressProviderProps {
  children: ReactNode;
}

export function VerifyProgressProvider({ children }: VerifyProgressProviderProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const setStep = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(4, step)));
  }, []);

  return (
    <VerifyProgressContext.Provider value={{ currentStep, setStep }}>
      {children}
    </VerifyProgressContext.Provider>
  );
}

export function useVerifyProgress(): VerifyProgressContextType {
  const ctx = useContext(VerifyProgressContext);
  if (!ctx) {
    return { currentStep: 1, setStep: () => {} };
  }
  return ctx;
}
