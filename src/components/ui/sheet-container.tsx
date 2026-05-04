'use client';

import { type ReactNode } from 'react';

interface SheetContainerProps {
  children: ReactNode;
}

export function SheetContainer({ children }: SheetContainerProps) {
  return (
    <div
      className="sheet-container bg-white  "
      
      style={{
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -16,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
