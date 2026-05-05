'use client';

import Image from "next/image";
import { haptic } from "@/lib/useHaptics";
import { LucideIcon } from "lucide-react";
import CustomRadioBTN from "./CustomRadioBTN";

interface RadioOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  accessibilityLabel?: string;
  icon?: string;
  IconComponent?: LucideIcon;
}

export function RadioOption({ label, selected, onSelect, accessibilityLabel, icon, IconComponent }: RadioOptionProps) {

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={accessibilityLabel || label}
      onClick={onSelect}
      onPointerDown={() => haptic('light')}
      className={`btn-press w-full flex items-center justify-between p-4 rounded-[14px] bg-white cursor-pointer transition-[border-color] duration-200 ease-in-out border ${selected ? 'border-text-primary' : 'border-border'
        }`}
    >

      <div className="flex items-center gap-4">

        {icon && (
          <div className="h-fit w-fit">
            <Image src={icon} alt={icon} width={1000} height={1000} className='h-full w-full object-contain' />

          </div>
        )}
        {IconComponent && (
          <div className="h-fit w-fit">
            <IconComponent className="w-5 h-5 text-text-primary" />
          </div>
        )}
        <span className="text-[14px] text-text-primary">
          {label}
        </span>
      </div>
      <CustomRadioBTN checked={selected} sizePx={22} />
    </button>
  );
}
