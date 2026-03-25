import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface SwipeIndicatorProps {
    currentIndex: number;
    totalCount: number;
    onPreviousPress?: () => void;
    onNextPress?: () => void;
  }
  
  export function SwipeIndicator({
    currentIndex,
    totalCount,
    onPreviousPress,
    onNextPress,
  }: SwipeIndicatorProps) {
    const canGoLeft = currentIndex > 0;
    const canGoRight = currentIndex < totalCount - 1;
  
    const counterText = `${(currentIndex + 1).toString().padStart(2, '0')}/${totalCount
      .toString()
      .padStart(2, '0')}`;
  
    const hintText = totalCount === 1
      ? <span className="text-xs text-text-secondary text-center font-medium">
          <span className="font-semibold text-text-primary">Tap</span> to view card details
        </span>
      : canGoRight
        ? <span className="text-xs text-text-secondary text-center font-medium inline-flex items-center gap-1">
            {/* <span className="font-semibold text-text-primary">Tap</span> to view details & */}
            <span className="font-semibold text-text-primary inline-flex items-center gap-0.5">
              <ArrowLeft size={20} className="mr-2" color="var(--color-primary)" /> Swipe Left
            </span> to see next cards
          </span>
        : <span className="text-xs text-text-secondary text-center font-medium inline-flex items-center gap-1">
            <span className="font-semibold text-text-primary inline-flex items-center gap-0.5">
              Swipe Right <ArrowRight size={20} className="mx-2" color="var(--color-primary)" />
            </span> to see previous cards
          </span>;
  
    const handlePrevious = () => {
      if (canGoLeft && onPreviousPress) {
        onPreviousPress();
      }
    };
  
    const handleNext = () => {
      if (canGoRight && onNextPress) {
        onNextPress();
      }
    };
  
    return (
      <div className="absolute left-0 right-0 bottom-[25%] flex flex-col items-center gap-2">
        {hintText}
        <div dir="ltr" className="flex flex-row items-center justify-center gap-4 mt-2">
          <button
            onClick={handlePrevious}
            disabled={!canGoLeft}
            className={`flex items-center justify-center w-11 h-11 bg-white rounded-full border  transition-all duration-200 active:scale-[0.92] hover:shadow-md ${
              canGoLeft 
                ? 'opacity-100 border-border hover:border-border cursor-pointer' 
                : 'opacity-30 border-border cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={18} className={canGoLeft ? "text-text-primary" : "text-text-secondary"} />
          </button>
          <span className="text-xs font-semibold text-text-primary min-w-[50px] text-center tracking-wide tabular-nums">
            {counterText}
          </span>
          <button
            onClick={handleNext}
            disabled={!canGoRight}
            className={`flex items-center justify-center w-11 h-11 bg-white rounded-full border  transition-all duration-200 active:scale-[0.92] hover:shadow-md ${
              canGoRight 
                ? 'opacity-100 border-border hover:border-border cursor-pointer' 
                : 'opacity-30 border-border cursor-not-allowed'
            }`}
          >
            <ChevronRight size={18} className={canGoRight ? "text-text-primary" : "text-text-secondary"} />
          </button>
        </div>
      </div>
    );
  }