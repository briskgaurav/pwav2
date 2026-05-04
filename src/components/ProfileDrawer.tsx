'use client'

import { type ReactNode, useCallback, useEffect, useRef } from 'react'

import gsap from 'gsap'
import Draggable from 'gsap/dist/Draggable'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable)
}

const DRAWER_WIDTH_PERCENT = 85
const CLOSE_THRESHOLD_PERCENT = 30

export type ProfileDrawerSide = 'left' | 'right'

interface ProfileDrawerProps {
  visible: boolean
  onClose: () => void
  side?: ProfileDrawerSide
  /** Receives animated close function so content can close with slide-out animation */
  children: ReactNode | ((closeAnimated: () => void) => ReactNode)
}

export function ProfileDrawer({
  visible,
  onClose,
  side = 'right',
  children,
}: ProfileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const draggableRef = useRef<Draggable[]>([])

  const isLeft = side === 'left'

  const handleClose = useCallback(() => {
    if (drawerRef.current && backdropRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
      })
      gsap.to(drawerRef.current, {
        x: isLeft ? '-100%' : '100%',
        duration: 0.5,
        ease: 'power3.in',
        onComplete: onClose,
      })
    } else {
      onClose()
    }
  }, [onClose, isLeft])

  const initDraggable = useCallback(() => {
    if (drawerRef.current && handleRef.current) {
      const drawerWidth = drawerRef.current.offsetWidth
      const threshold = drawerWidth * (CLOSE_THRESHOLD_PERCENT / 100)

      draggableRef.current = Draggable.create(drawerRef.current, {
        type: 'x',
        trigger: handleRef.current,
        bounds: isLeft ? { minX: -drawerWidth, maxX: 0 } : { minX: 0, maxX: drawerWidth },
        inertia: true,
        onDragEnd: function () {
          const endX = this.endX ?? this.x
          if (isLeft) {
            if (endX < -threshold) handleClose()
            else gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: 'power3.out' })
            return
          }

          if (endX > threshold) handleClose()
          else gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: 'power3.out' })
        },
      })
    }
  }, [handleClose, isLeft])

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'

      if (drawerRef.current && backdropRef.current) {
        gsap.set(drawerRef.current, { x: isLeft ? '-100%' : '100%' })
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: .5, ease: 'power2.out' }
        )
        gsap.to(drawerRef.current, {
          x: 0,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: initDraggable,
        })
      }
    } else {
      document.body.style.overflow = 'unset'
      if (draggableRef.current.length > 0) {
        draggableRef.current.forEach((d) => d.kill())
        draggableRef.current = []
      }
    }
    return () => {
      document.body.style.overflow = 'unset'
      if (draggableRef.current.length > 0) {
        draggableRef.current.forEach((d) => d.kill())
        draggableRef.current = []
      }
    }
  }, [visible, initDraggable, isLeft])

  if (!visible) return null

  return (
    <>
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/50 z-999!"
        style={{ opacity: 0 }}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        className={`fixed top-0 bottom-0 w-[85vw] max-w-[400px] bg-white z-99999 shadow-xl flex flex-col ${isLeft ? 'left-0' : 'right-0'}`}
        style={{ transform: isLeft ? 'translateX(-100%)' : 'translateX(100%)' }}
      >
        <div
          ref={handleRef}
          className={`absolute top-0 bottom-0 w-6 flex justify-center items-center cursor-grab active:cursor-grabbing touch-none z-10 ${isLeft ? 'right-0' : 'left-0'}`}
          aria-label="Drag to close"
        >
          <div className="w-1 h-10 rounded-full bg-border" />
        </div>
        {typeof children === 'function' ? children(handleClose) : children}
      </div>
    </>
  )
}
