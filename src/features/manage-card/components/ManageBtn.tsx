'use client'
import { useAuth } from '@/lib/auth-context'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function ManageBtn({icon, title, href, fullWidth = false}: {icon: string, title: string, href: string, fullWidth?: boolean}) {
    const {isDarkMode} = useAuth()
    return (
        <Link href={href} className={`px-2 py-5 ${fullWidth ? 'w-[48%]' : 'w-[30vw] shrink-0'} h-[110px] flex flex-col items-center justify-start rounded-xl bg-background2`}>
            <div className="h-7 w-7 flex items-center justify-center shrink-0">
                <Image src={icon} alt={title} width={28} height={28} className={`h-auto w-full object-contain ${isDarkMode ? 'invert' : ''}`} />
            </div>
            <p className="text-text-primary text-xs mt-3 w-[80%] text-center line-clamp-2">{title}</p>
        </Link>
    )
}
