import VerifyLayoutClient from './VerifyLayoutClient';

export const metadata = {
  title: 'Verify Identity | DSW',
  description: 'Verify your identity with face recognition',
};

export default function VerifyLayout({ children }) {
  return <VerifyLayoutClient>{children}</VerifyLayoutClient>;
}
