'use client';


import { notifyUserCancelled } from '@/lib/bridge';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showCross?: boolean;
}

export function Header({ title = 'Instacard', showBackButton = false, onBack, showCross = true }: HeaderProps) {
  // Close button (X) - always closes the WebView and returns to native app
  const handleClose = () => {
    notifyUserCancelled();
  };

  // Back button (arrow) - navigates back within the PWA
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <header
      className="flex flex-col items-start justify-between px-4  py-[calc(env(safe-area-inset-top,12px)+12px)]"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      {showBackButton && (
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="btn-press w-10 h-10 rounded-full bg-white/20 border-none flex items-center justify-center cursor-pointer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* <div className='w-full py-[1vw] pt-[5vw] items-center justify-between flex h-fit'>
        <div className='flex items-center gap-2'>

          {showBackButton && (
            <div className='w-fit h-fit'>
              <span onClick={handleBack} className='w-full h-full'>

                <ChevronLeft size={30} color='white' />
              </span>
            </div>
          )}

          <div className='flex items-center gap-4'>

            <div className='w-10 h-10 '>
              <Image src={'/img/instacard.png'} alt='Instacard Logo' width={1000} height={1000} className='h-full w-full object-contain' />
            </div>

            <h1
              className="text-lg font-semibold m-0 text-white"
            >
              Instacard
            </h1>

          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='w-full h-full'>

            <Search size={20} color='white' />
          </div>
          <div className='w-full h-full'>

            <CircleQuestionMark size={20} color='white' />
          </div>

          <div className='w-[12vw] h-[12vw] bg-white border border-error rounded-full aspect-square'>

          </div>
        </div>


      </div> */}

      <h1
        className="text-md pl-10 font-normal py-4 text-white m-0"
      >
        {title}
      </h1>



      {/* {showCross && (
        <button
          onClick={handleClose}
          aria-label="Close"
          className="btn-press w-10 h-10 rounded-full bg-white/20 border-none flex items-center justify-center cursor-pointer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )} */}
    </header>
  );
}
