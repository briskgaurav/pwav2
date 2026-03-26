'use client';

export default function FaceGuide({ isValid = false }) {
  const borderColor = isValid ? 'border-green-500' : 'border-white';
  const cornerClasses = `absolute w-8 h-8 transition-colors duration-300 ${borderColor}`;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-start justify-center">
      {/* Rounded rectangle border */}
      <div className="relative w-[70%] mt-[15%] aspect-[4/5] max-w-[300px]">
        <div
          className={`absolute inset-0 rounded-3xl border-2 transition-all duration-300 ${borderColor}`}
        />

        {/* Corner markers */}
        <div className={`${cornerClasses} -top-2 -left-2 border-l-4 border-t-4 rounded-tl-3xl`} />
        <div className={`${cornerClasses} -top-2 -right-2 border-r-4 border-t-4 rounded-tr-3xl`} />
        <div className={`${cornerClasses} -bottom-2 -left-2 border-l-4 border-b-4 rounded-bl-3xl`} />
        <div className={`${cornerClasses} -bottom-2 -right-2 border-r-4 border-b-4 rounded-br-3xl`} />
      </div>
    </div>
  );
}
