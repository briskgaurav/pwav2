'use client';

import { ReactNode } from 'react';
import { InstacardColors } from '@/constants/colors';

interface SheetContainerProps {
  children: ReactNode;
}

export function SheetContainer({ children }: SheetContainerProps) {
  return (
    <div
      className="sheet-container  "
      style={{
        flex: 1,
        backgroundColor: InstacardColors.white,
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
