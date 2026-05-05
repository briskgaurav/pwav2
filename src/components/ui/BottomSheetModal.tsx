'use client';

import { X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Draggable from 'gsap/dist/Draggable';
import { useAuth } from '@/lib/auth-context';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

export interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  showTitle?: boolean;
  children?: React.ReactNode;
  maxHeight?: number;
  recommendedAmount?: string;
  backdropBlur?: boolean;
}

export default function BottomSheetModal({
  showTitle = true,
  recommendedAmount,
  visible,
  onClose,
  title,
  children,
  backdropBlur = false,
  maxHeight = 1.0,
}: BottomSheetModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable[]>([]);
  const { isDarkMode } = useAuth();
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const handleClose = useCallback(() => {
    if (modalRef.current && backdropRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });
      gsap.to(modalRef.current, {
        y: '100%',
        duration: 0.3,
        ease: 'power3.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  }, [onClose]);

  const initDraggable = useCallback(() => {
    if (modalRef.current && handleRef.current) {
      const modalHeight = modalRef.current.offsetHeight;
      const threshold = modalHeight * 0.3;

      draggableRef.current = Draggable.create(modalRef.current, {
        type: 'y',
        trigger: handleRef.current,
        bounds: { minY: 0, maxY: window.innerHeight },
        inertia: true,
        onDragEnd: function () {
          const endY = this.endY ?? this.y;
          if (endY > threshold) {
            handleClose();
          } else {
            gsap.to(modalRef.current, {
              y: 0,
              duration: 0.3,
              ease: 'power3.out',
            });
          }
        },
      });
    }
  }, [handleClose]);

  // ── VisualViewport keyboard avoidance ──────────────────────────────────
  useEffect(() => {
    if (!visible) {
      setKeyboardOffset(0);
      return;
    }

    const vv = window.visualViewport;
    if (!vv) return;

    const onViewportChange = () => {
      // vv.offsetTop: how far the visual viewport has been scrolled away from the
      // layout viewport's top (happens when keyboard pushes view up on some browsers).
      // keyboard height = layout bottom minus visual viewport bottom.
      const layoutBottom = window.innerHeight;
      const visualBottom = vv.offsetTop + vv.height;
      const kbHeight = Math.max(0, layoutBottom - visualBottom);
      setKeyboardOffset(kbHeight);
    };

    onViewportChange();
    vv.addEventListener('resize', onViewportChange);
    vv.addEventListener('scroll', onViewportChange);

    return () => {
      vv.removeEventListener('resize', onViewportChange);
      vv.removeEventListener('scroll', onViewportChange);
    };
  }, [visible]);
  // ───────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      if (modalRef.current && backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo(
          modalRef.current,
          { y: '100%' },
          { y: '0%', duration: 0.4, ease: 'power3.out', onComplete: initDraggable }
        );
      }
    } else {
      document.body.style.overflow = 'unset';
      if (draggableRef.current.length > 0) {
        draggableRef.current.forEach((d) => d.kill());
        draggableRef.current = [];
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (draggableRef.current.length > 0) {
        draggableRef.current.forEach((d) => d.kill());
        draggableRef.current = [];
      }
    };
  }, [initDraggable, visible]);

  if (!visible) return null;

  const maxHeightVh = maxHeight * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{
        // Lift the entire overlay upward by the keyboard height so the sheet
        // always sits above the software keyboard on iOS / Android.
        bottom: keyboardOffset,
        top: 0,
        transition: 'bottom 0.25s ease-out',
      }}
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/20"
        onClick={handleClose}
        aria-hidden
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-modal-title' : undefined}
        className={`relative w-full   rounded-t-[28px] border border-border overflow-hidden ${backdropBlur ? 'backdrop-blur-lg bg-white/64' : 'bg-white'}`}
        style={{
          maxHeight: `${maxHeightVh}vh`,
        }}
      >
        <div
          ref={handleRef}
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
        >
          <div className={`w-[42px] h-[5px] rounded-full  ${backdropBlur ? 'bg-white' : 'bg-border'}`} />
        </div>

        <div
          className="overflow-y-auto  pb-6"
          style={{ maxHeight: `calc(${maxHeightVh}vh - 40px)` }}
        >
          {title != null && showTitle && (
            <>
              <div className="flex items-center px-5 justify-between">
                <h2
                  id="bottom-sheet-modal-title"
                  className="text-sm font-normal flex-1 text-text-primary leading-5"
                >
                  {title}
                </h2>

                <div className='flex items-center gap-2'>
             {
              recommendedAmount && (
                <p className='text-text-primary text-md font-medium'><span className='line-through mr-1'>N</span> {recommendedAmount}</p>
              )
             }

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center"
                  aria-label="Close"
                  >
                  <X size={20} color={isDarkMode ? 'white' : 'text-text-secondary'} />
                </button>
                  </div>
              </div>
              <div className="h-px bg-border my-4" />
            </>
          )}
          <div className='px-5 space-y-2'>

          {children}
          </div>
        </div>
      </div>
    </div>
  );
}
