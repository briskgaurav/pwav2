export const metadata = {
  title: 'Verify Identity | DSW',
  description: 'Verify your identity with face recognition',
};

export default function VerifyLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
