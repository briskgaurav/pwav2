'use client'

import React, { useState } from 'react'

import { ChevronDown, Check } from 'lucide-react'

export interface DropdownOption {
    id: string
    [key: string]: unknown
}

export interface DropdownProps<T extends DropdownOption> {
    label?: string
    placeholder?: string
    value: T | null
    options: T[]
    onChange: (value: T) => void
    getOptionLabel: (option: T) => string
    getOptionKey?: (option: T) => string
    disabled?: boolean
    className?: string
    marginTop?: string
}

export function Dropdown<T extends DropdownOption>({
    label,
    placeholder = 'Select...',
    value,
    options,
    onChange,
    getOptionLabel,
    getOptionKey = (opt) => opt.id,
    disabled = false,
    className = '',
    marginTop = 'top-[100%]',
}: DropdownProps<T>) {
    const [open, setOpen] = useState(false)

    return (
        <div className={`relative z-10 ${className}`}>
            {label && (
                <p className="text-text-primary text-sm font-medium mb-2">{label}</p>
            )}
            <div className="relative">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setOpen(!open)}
                    className={`w-full border border-border rounded-2xl px-4 py-4 text-text-primary text-sm bg-transparent focus:outline-none focus:border-primary flex items-center justify-between transition-colors hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <span className="font-medium truncate">
                        {value ? getOptionLabel(value) : placeholder}
                    </span>
                    <ChevronDown
                        className={`w-5 h-5 text-text-primary/60 transition-transform duration-200 ${
                            open ? 'rotate-180' : ''
                        }`}
                    />
                </button>

                {open && (
                    <div className={`absolute  left-0 bg-white right-0 mt-2 bg-background border border-border rounded-2xl overflow-hidden shadow-lg z-10 ${marginTop}`}>
                        {options.map((option) => {
                            const isSelected = value ? getOptionKey(value) === getOptionKey(option) : false
                            return (
                                <button
                                    key={getOptionKey(option)}
                                    type="button"
                                    onClick={() => {
                                        onChange(option)
                                        setOpen(false)
                                    }}
                                    className={`w-full px-4 py-4 text-left flex items-center justify-between hover:bg-primary/5 transition-colors ${
                                        isSelected ? 'bg-primary/10' : ''
                                    }`}
                                >
                                    <span className="text-text-primary text-sm font-medium truncate">
                                        {getOptionLabel(option)}
                                    </span>
                                    {isSelected && <Check className="w-5 h-5 text-primary shrink-0" />}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dropdown
