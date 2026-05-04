'use client';

import { forwardRef } from 'react';

const CameraView = forwardRef(({ className = '' }, ref) => {
  return (
    <div className={`absolute inset-0 bg-black overflow-hidden ${className}`}>
      <video
        ref={ref}
        autoPlay
        playsInline
        muted
        controls={false}
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: 'scaleX(-1)',
          minWidth: '100%',
          minHeight: '100%',
        }}
      />
    </div>
  );
});

export default CameraView;