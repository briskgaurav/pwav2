'use client';

export default function FaceGuide({ isValid = false }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* Rounded rectangle border */}
      <div className="relative w-[70%] aspect-[4/5] max-w-[300px]" style={{ marginTop: '-5%' }}>
        <div
          className={`
            absolute inset-0 rounded-3xl border-2
            transition-all duration-300
            ${isValid ? 'border-green-500' : 'border-white border-dashed'}
          `}
        />

        {/* Corner markers */}
        <div className={`absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 rounded-tl-3xl transition-colors duration-300 ${isValid ? 'border-green-500' : 'border-white'}`} />
        <div className={`absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 rounded-tr-3xl transition-colors duration-300 ${isValid ? 'border-green-500' : 'border-white'}`} />
        <div className={`absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 rounded-bl-3xl transition-colors duration-300 ${isValid ? 'border-green-500' : 'border-white'}`} />
        <div className={`absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 rounded-br-3xl transition-colors duration-300 ${isValid ? 'border-green-500' : 'border-white'}`} />
      </div>

      {/* Instructions text */}
      <div className="absolute bottom-24 left-0 right-0 text-center">
        <p className="text-white text-sm font-medium px-4">
          {isValid ? 'Hold still...' : 'Position your face within the frame'}
        </p>
      </div>
    </div>
  );
}
