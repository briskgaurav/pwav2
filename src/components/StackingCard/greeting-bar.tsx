'use client';

import Image from 'next/image';

interface GreetingBarProps {
  userName: string;
  onSearchPress?: () => void;
  onHelpPress?: () => void;
  onAvatarPress?: () => void;
  isDarkMode?: boolean;
}

export function GreetingBar({
  userName,
  onSearchPress,
  onHelpPress,
  onAvatarPress,
  isDarkMode,
}: GreetingBarProps) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <p
        className="text-base font-normal text-text-primary"
        aria-label={`Hello, ${userName}`}
      >
        Hello, {userName}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSearchPress}
          aria-label="Search"
          className="h-5 w-5 flex items-center justify-center rounded-full  transition"
        >
            <Image
              src="/svg/greetingbar/search.svg"
              alt="Search"
              height={20}
              width={20}
              className="object-contain -translate-y-0.5 h-full w-full invert"
            />
        </button>

        <button
          type="button"
          onClick={onHelpPress}
          aria-label="Help"
          className="h-9 w-9 flex items-center justify-center rounded-full  transition"
        >
            <Image
              src="/svg/greetingbar/faq.svg"
              alt="Help"
              height={36}
              width={36}
              className="object-contain h-full w-full invert"
            />
        </button>

        <button
          type="button"
          onClick={onAvatarPress}
          aria-label="Open profile"
          className="h-12 w-12 flex items-center justify-center rounded-full"
        >
            <Image
              src="/svg/greetingbar/avtar.svg"
              alt="Profile"
              height={36}
              width={36}
              className="object-contain h-full w-full"
            />
        </button>
      </div>
    </div>
  );
}

export default GreetingBar;
