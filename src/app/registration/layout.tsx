import type { ReactNode } from 'react';
import RegistrationKycLayoutClient from './RegistrationKycLayoutClient';

export const metadata = {
  title: 'Complete KYC | Instacard',
  description: 'Verify your details to complete KYC.',
};

export default function RegistrationLayout({ children }: { children: ReactNode }) {
  return <RegistrationKycLayoutClient>{children}</RegistrationKycLayoutClient>;
}

