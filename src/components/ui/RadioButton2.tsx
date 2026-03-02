'use client';

import { Check, LucideIcon } from "lucide-react";
import Image from "next/image";
import { haptic } from "@/lib/useHaptics";

interface RadioOptionProps {
    label: string;
    selected: boolean;
    onSelect: () => void;
    accessibilityLabel?: string;
    icon?: string;
    IconComponent?: LucideIcon;
}

export function RadioOption2({ label, selected, onSelect, accessibilityLabel, icon, IconComponent }: RadioOptionProps) {
    const handleSelect = () => {
        haptic('light');
        onSelect();
    };

    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={accessibilityLabel || label}
            onClick={handleSelect}
            className={`btn-press w-full flex items-center justify-between p-4 rounded-[14px]  bg-white cursor-pointer transition-[border-color] duration-200 ease-in-out border ${selected ? 'border-text-primary/10' : 'border-border'
                }`}
        >

            <div className="flex items-center gap-4">

                {IconComponent && (
                    <div className="h-5 w-5 text-text-primary flex items-center justify-center">
                        <IconComponent size={20} />
                    </div>
                )}
                {icon && !IconComponent && (
                    <div className="h-5 w-5 text-text-primary">
                        <Image src={icon} alt={label} width={20} height={20} className='h-full w-full object-contain' />
                    </div>
                )}
                <span className="text-[14px] text-text-primary">
                    {label}
                </span>
            </div>
            {selected ? (
                <span
                    className={`w-[22px] h-[22px] bg-orange p-1.5 rounded-full  flex items-center justify-center transition-[border-color] duration-200 ease-in-out`}
                >
                    <Check strokeWidth={3} color="white" />
                </span>
            ) : (
                <span
                    className={`w-[20px] border-2 border-text-primary h-[20px]  p-1.5 rounded-full  flex items-center justify-center transition-[border-color] duration-200 ease-in-out`}
                >
                </span>
            )}
        </button>
    );
}
