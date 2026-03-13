'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with camera/face-api
const VerifyContainer = dynamic(
  () => import('@/components/Verify/VerifyContainer'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
          <p className="text-gray-500">Loading verification...</p>
        </div>
      </div>
    ),
  }
);

export default function VerifyPage() {
  return <VerifyContainer />;
}
