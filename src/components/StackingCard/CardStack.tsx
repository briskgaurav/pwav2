'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import { CardData } from './cardData';
import { CardItem } from './CardItem';

// Stack configuration (mirrors React Native version)
const STACK_CONFIG = {
  VISIBLE_CARDS: 10,
  VERTICAL_OFFSET: -20,
  SCALE_FACTOR: 0.05,
  SWIPE_THRESHOLD: 120,
  SWIPE_VELOCITY_THRESHOLD: 1500,
};

const STACK_DRAG_DISTANCE = STACK_CONFIG.SWIPE_THRESHOLD * 1.6;

const SMOOTH_EASE = 'power2.out';
const SNAP_BACK_EASE = 'back.out';
const SLIDE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export interface CardStackRef {
  goToNext: () => void;
  goToPrevious: () => void;
}

interface CardStackProps {
  cards: CardData[];
  onCardPress?: (card: CardData) => void;
  onCardChange?: (index: number) => void;
  isDrawerOpen?: boolean;
  selectedCardId?: string | null;
}

export const CardStack = forwardRef<CardStackRef, CardStackProps>(
  function CardStack(
    {
      cards,
      onCardPress,
      onCardChange,
      isDrawerOpen = false,
      selectedCardId = null,
    },
    ref
  ) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const effectiveIndexRef = useRef(0);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const isSwiping = useRef(false);
    const isAnimatingBack = useRef(false);

    // Mutable object so GSAP can animate its properties
    const anim = useRef({
      translationX: 0,
      stackProgress: 0,
      slideBackX: typeof window !== 'undefined' ? -window.innerWidth : -800,
      focusProgress: 0,
      selectedIndex: 0,
    });

    const pointerStart = useRef({ x: 0, translationX: 0 });
    const swipeOutDistance =
      typeof window !== 'undefined' ? window.innerWidth * 1.2 : 1000;

    // Helper function to interpolate values
    const interpolate = (
      value: number,
      inputRange: [number, number],
      outputRange: [number, number],
      clamp = true
    ) => {
      const [inputMin, inputMax] = inputRange;
      const [outputMin, outputMax] = outputRange;
      let result =
        outputMin +
        ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);
      if (clamp) {
        result = Math.max(
          Math.min(outputMin, outputMax),
          Math.min(Math.max(outputMin, outputMax), result)
        );
      }
      return result;
    };

    const applyCardTransforms = useCallback(() => {
      const { translationX, stackProgress, slideBackX, focusProgress, selectedIndex } =
        anim.current;
      const totalCards = cards.length;
      const idx = effectiveIndexRef.current;

      for (let i = 0; i < totalCards; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const stackPosition = i - idx;

        // Focus mode calculations (when drawer is open)
        const selectionDistance = Math.abs(i - selectedIndex);
        const selectionStrength = interpolate(
          selectionDistance,
          [0, 0.85],
          [1, 0]
        );
        const dimOpacity = interpolate(selectionDistance, [0, 1], [1, 0]);
        const focusOpacity = interpolate(
          focusProgress,
          [0, 1],
          [1, dimOpacity]
        );
        const focusLift = interpolate(
          focusProgress,
          [0, 1],
          [0, -150 * selectionStrength]
        );
        const focusScale = interpolate(
          focusProgress,
          [0, 1],
          [1, 1 - 0.3 * selectionStrength]
        );

        if (stackPosition < 0 || stackPosition >= STACK_CONFIG.VISIBLE_CARDS) {
          gsap.set(el, {
            opacity: 0,
            scale: 0.5,
            x: 0,
            xPercent: -50,
            y: 0,
            rotation: 0,
            zIndex: -1,
          });
          continue;
        }

        const isFrontCard = stackPosition === 0;

        if (isFrontCard) {
          if (isAnimatingBack.current) {
            const rotation = interpolate(
              slideBackX,
              [-STACK_CONFIG.SWIPE_THRESHOLD * 2, 0],
              [-12, 0]
            );
            gsap.set(el, {
              opacity: 1,
              x: slideBackX,
              xPercent: -50,
              y: focusLift,
              rotation,
              scale: 1,
              zIndex: totalCards,
            });
          } else {
            const effectiveX = translationX < 0 ? translationX : 0;
            const rotation = interpolate(
              effectiveX,
              [-STACK_CONFIG.SWIPE_THRESHOLD * 2, 0],
              [-12, 0]
            );
            const opacity = interpolate(
              Math.abs(effectiveX),
              [0, STACK_CONFIG.SWIPE_THRESHOLD * 2],
              [1, 0.8]
            );
            gsap.set(el, {
              opacity: opacity * focusOpacity,
              x: effectiveX,
              xPercent: -50,
              y: focusLift,
              rotation,
              scale: focusScale,
              zIndex: totalCards - stackPosition,
            });
          }
          continue;
        }

        // Cards behind
        const currentScale = 1 - stackPosition * STACK_CONFIG.SCALE_FACTOR;
        const currentTranslateY = stackPosition * STACK_CONFIG.VERTICAL_OFFSET;
        const forwardScale = 1 - (stackPosition - 1) * STACK_CONFIG.SCALE_FACTOR;
        const forwardTranslateY =
          (stackPosition - 1) * STACK_CONFIG.VERTICAL_OFFSET;

        let scale = currentScale;
        let translateY = currentTranslateY;

        if (isAnimatingBack.current && typeof window !== 'undefined') {
          const backwardProgress = interpolate(
            slideBackX,
            [-window.innerWidth, 0],
            [1, 0]
          );
          scale = interpolate(
            backwardProgress,
            [0, 1],
            [currentScale, forwardScale],
            false
          );
          translateY = interpolate(
            backwardProgress,
            [0, 1],
            [currentTranslateY, forwardTranslateY],
            false
          );
        } else if (stackProgress > 0) {
          scale = interpolate(
            stackProgress,
            [0, 1],
            [currentScale, forwardScale]
          );
          translateY = interpolate(
            stackProgress,
            [0, 1],
            [currentTranslateY, forwardTranslateY]
          );
        }

        const depthOpacity = interpolate(stackPosition, [0, 10], [1, 0.9]);

        gsap.set(el, {
          opacity: depthOpacity * focusOpacity,
          x: 0,
          xPercent: -50,
          y: translateY,
          rotation: 0,
          scale: scale * focusScale,
          zIndex: totalCards - stackPosition,
        });
      }
    }, [cards.length]);

    const goToNext = useCallback(() => {
      if (cards.length <= 1 || currentIndex >= cards.length - 1) return;
      if (isSwiping.current) return;
      isSwiping.current = true;

      gsap.to(anim.current, {
        translationX: -swipeOutDistance,
        duration: 0.4,
        ease: SMOOTH_EASE,
      });
      gsap.to(anim.current, {
        stackProgress: 1,
        duration: 0.4,
        ease: SMOOTH_EASE,
        onUpdate: applyCardTransforms,
        onComplete: () => {
          const nextIndex = currentIndex + 1;
          setCurrentIndex((prev) => prev + 1);
          effectiveIndexRef.current = nextIndex;
          anim.current.translationX = 0;
          anim.current.stackProgress = 0;
          anim.current.selectedIndex = nextIndex;
          isSwiping.current = false;
          applyCardTransforms();
          onCardChange?.(nextIndex);
        },
      });
    }, [
      cards.length,
      currentIndex,
      swipeOutDistance,
      applyCardTransforms,
      onCardChange,
    ]);

    const goToPrevious = useCallback(() => {
      if (cards.length <= 1 || currentIndex <= 0) return;
      if (isSwiping.current) return;
      isSwiping.current = true;

      anim.current.translationX = 0;
      anim.current.stackProgress = 0;
      isAnimatingBack.current = true;
      anim.current.slideBackX = -swipeOutDistance;
      effectiveIndexRef.current = currentIndex - 1;
      setCurrentIndex((prev) => prev - 1);
      anim.current.selectedIndex = currentIndex - 1;
      onCardChange?.(currentIndex - 1);

      gsap.to(anim.current, {
        slideBackX: 0,
        duration: 0.4,
        ease: SMOOTH_EASE,
        onUpdate: applyCardTransforms,
        onComplete: () => {
          isAnimatingBack.current = false;
          isSwiping.current = false;
          applyCardTransforms();
        },
      });
    }, [
      cards.length,
      currentIndex,
      swipeOutDistance,
      applyCardTransforms,
      onCardChange,
    ]);

    useImperativeHandle(ref, () => ({ goToNext, goToPrevious }), [
      goToNext,
      goToPrevious,
    ]);

    // Keep effective index in sync when not animating back
    useEffect(() => {
      if (!isAnimatingBack.current) effectiveIndexRef.current = currentIndex;
    }, [currentIndex]);

    // Animate focus when drawer opens/closes
    useEffect(() => {
      gsap.to(anim.current, {
        focusProgress: isDrawerOpen ? 1 : 0,
        duration: 0.25,
        ease: 'power2.out',
        onUpdate: applyCardTransforms,
      });
    }, [isDrawerOpen, applyCardTransforms]);

    // Reset when cards change
    useEffect(() => {
      isSwiping.current = false;
      isAnimatingBack.current = false;
      setCurrentIndex(0);
      effectiveIndexRef.current = 0;
      anim.current.translationX = 0;
      anim.current.stackProgress = 0;
      anim.current.slideBackX =
        typeof window !== 'undefined' ? -window.innerWidth : -800;
      anim.current.selectedIndex = 0;
      requestAnimationFrame(applyCardTransforms);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards]);

    // Sync to selected card from drawer
    useEffect(() => {
      if (!selectedCardId) return;
      const idx = cards.findIndex((c) => c.id === selectedCardId);
      if (idx < 0) return;
      isSwiping.current = false;
      isAnimatingBack.current = false;
      effectiveIndexRef.current = idx;
      anim.current.translationX = 0;
      anim.current.stackProgress = 0;
      anim.current.slideBackX =
        typeof window !== 'undefined' ? -window.innerWidth : -800;
      setCurrentIndex(idx);
      gsap.to(anim.current, {
        selectedIndex: idx,
        duration: 0.24,
        ease: 'power2.out',
        onUpdate: applyCardTransforms,
      });
    }, [selectedCardId, cards, applyCardTransforms]);

    useEffect(() => {
      applyCardTransforms();
    }, [currentIndex, applyCardTransforms]);

    // Pointer drag
    const onPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (isDrawerOpen || isSwiping.current || cards.length <= 1) return;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        pointerStart.current = {
          x: e.clientX,
          translationX: anim.current.translationX,
        };
      },
      [isDrawerOpen, cards.length]
    );

    const onPointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (isDrawerOpen || isSwiping.current) return;
        const deltaX = e.clientX - pointerStart.current.x;
        anim.current.translationX = pointerStart.current.translationX + deltaX;
        if (anim.current.translationX < 0) {
          anim.current.stackProgress = Math.min(
            1,
            Math.abs(anim.current.translationX) / STACK_DRAG_DISTANCE
          );
        } else {
          anim.current.stackProgress = 0;
        }
        applyCardTransforms();
      },
      [isDrawerOpen, applyCardTransforms]
    );

    const onPointerUp = useCallback(
      (e: React.PointerEvent) => {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        if (isDrawerOpen || isSwiping.current) return;

        const { translationX } = anim.current;
        const deltaX = e.clientX - pointerStart.current.x;
        const velocity = Math.abs(deltaX) > 10 ? deltaX * 10 : 0;
        const thresholdMet =
          Math.abs(translationX) > STACK_CONFIG.SWIPE_THRESHOLD ||
          Math.abs(velocity) > STACK_CONFIG.SWIPE_VELOCITY_THRESHOLD;
        const swipingLeft = translationX < 0 || velocity < 0;
        const swipingRight = translationX > 0 || velocity > 0;
        const canSwipeLeft =
          swipingLeft && cards.length > 1 && currentIndex < cards.length - 1;
        const canSwipeRight =
          swipingRight && cards.length > 1 && currentIndex > 0;

        if (thresholdMet && canSwipeLeft) {
          goToNext();
        } else if (thresholdMet && canSwipeRight) {
          goToPrevious();
        } else {
          gsap.to(anim.current, {
            translationX: 0,
            stackProgress: 0,
            duration: 0.4,
            ease: SNAP_BACK_EASE,
            onUpdate: applyCardTransforms,
            onComplete: applyCardTransforms,
          });
        }
      },
      [
        isDrawerOpen,
        cards.length,
        currentIndex,
        goToNext,
        goToPrevious,
        applyCardTransforms,
      ]
    );

    if (!cards.length) return null;

    const visibleCards = [...cards].reverse().map((card, reversedIdx) => {
      const index = cards.length - 1 - reversedIdx;
      return (
        <div
          key={card.id}
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
          className="absolute w-full max-w-[90%] mx-auto top-[19vh] left-1/2 will-change-transform"
        >
          <CardItem card={card} onPress={onCardPress} />
        </div>
      );
    });

    return (
      <div ref={containerRef} className="relative px-4">
        <div
          className="w-full flex justify-center"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={(e) => {
            if (e.buttons === 0) return;
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
          }}
        >
          {visibleCards}
        </div>
      </div>
    );
  }
);

export default CardStack;
