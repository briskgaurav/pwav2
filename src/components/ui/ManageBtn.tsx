'use client'
import { useAuth } from '@/lib/auth-context'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type ManageBtnIcon = React.ComponentType<{ className?: string }> | string

export default function ManageBtn({ icon, title, href, fullWidth = false }: { icon: ManageBtnIcon; title: string; href: string; fullWidth?: boolean }) {
  const { isDarkMode } = useAuth()
  const iconClassName = `h-auto w-full object-contain ${isDarkMode ? 'invert' : ''}`
  return (
    <Link href={href} className={`px-2 py-5 ${fullWidth ? 'w-[48%]' : 'w-[30vw] shrink-0'} h-[110px] flex flex-col items-center justify-start rounded-xl bg-background2`}>
      <div className="h-7 w-7 flex items-center justify-center shrink-0">
        {typeof icon === 'string' ? (
          <Image src={icon} alt={title} width={28} height={28} className={iconClassName} />
        ) : (
          React.createElement(icon, { className: iconClassName })
        )}
      </div>
      <p className="text-text-primary text-xs mt-3 w-[90%] text-center line-clamp-2">{title}</p>
    </Link>
    )
}
