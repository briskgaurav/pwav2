'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { haptic } from '@/lib/useHaptics';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'error';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, disabled, children, className, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        haptic('light');
      }
      onClick?.(e);
    };

    const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium border-none transition-all duration-100 ease-out';
    
    const variantClasses: Record<string, string> = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-gray-100 dark:bg-gray-800 text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700',
      ghost: 'bg-transparent text-primary hover:bg-primary/10',
      error: 'bg-error text-white hover:bg-error/90',
    };

    const sizeClasses: Record<string, string> = {
      sm: 'px-5 py-2.5 text-[10px]',
      md: 'px-6 py-4 text-sm',
      lg: 'px-8 py-[18px] text-[17px]',
    };

    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
    const widthClasses = fullWidth ? 'w-full' : 'w-auto';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`btn-press ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className || ''}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
