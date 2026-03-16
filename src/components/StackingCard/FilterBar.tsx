'use client';

import { useState } from 'react';
import { BarChart2, Check, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useCardWalletStore } from '@/store/useCardWalletStore';
import { routes } from '@/lib/routes';

export type CardFilterType = 'all' | 'debit' | 'credit' | 'prepaid' | 'gift';

export type FilterTab = 'all' | 'recent';

export type SortByValue = 'recent' | 'most-used';

const FILTER_LABELS: Record<CardFilterType, string> = {
  all: 'All Cards',
  debit: 'Debit',
  credit: 'Credit',
  prepaid: 'Pre-Paid',
  gift: 'Gift',
};

function getFilterLabel(filters: CardFilterType[]): string {
  if (filters.includes('all') || filters.length === 0) {
    return 'All Cards';
  }
  if (filters.length === 1) {
    return `${FILTER_LABELS[filters[0]]} Cards`;
  }
  if (filters.length === 2) {
    return `${FILTER_LABELS[filters[0]]}, ${FILTER_LABELS[filters[1]]}`;
  }
  return `${filters.length} Selected`;
}

type ModeValue = 'virtual' | 'universal';

interface FilterBarProps {
  cardFilters?: CardFilterType[];
  onCardFiltersChange?: (filters: CardFilterType[]) => void;
  sortBy?: SortByValue;
  onSortChange?: (sort: SortByValue) => void;
  mode: ModeValue;
  onModeChange: (mode: ModeValue) => void;
  isDarkMode?: boolean;
}

const SORT_ICONS = [
  { id: 'recent' as SortByValue, Icon: RecentSortIcon, label: 'Recently Used' },
  { id: 'most-used' as SortByValue, Icon: BarChart2, label: 'Most Used' },
];

const TOGGLE_OPTIONS: Array<{ id: ModeValue; label: string }> = [
  { id: 'virtual', label: 'Virtual' },
  { id: 'universal', label: 'Universal' },
];

const FILTER_OPTIONS: { id: CardFilterType; label: string }[] = [
  { id: 'all', label: 'All Cards' },
  { id: 'debit', label: 'Debit Card' },
  { id: 'credit', label: 'Credit Card' },
  { id: 'prepaid', label: 'Pre-Paid Card' },
  { id: 'gift', label: 'Gift Card' },
];

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M0.637512 2.41699H7.76091C7.95741 3.196 8.67556 3.77536 9.52932 3.77536C10.3831 3.77536 11.1012 3.196 11.2977 2.41699H13.7625C14.0041 2.41699 14.2 2.22477 14.2 1.98769C14.2 1.75061 14.0041 1.5584 13.7625 1.5584H11.2977C11.1012 0.779385 10.3831 0.199997 9.52929 0.199997C8.67551 0.199997 7.95735 0.779385 7.76089 1.5584H0.637512C0.395903 1.5584 0.200012 1.75061 0.200012 1.98769C0.200012 2.22477 0.395903 2.41699 0.637512 2.41699ZM9.52932 1.05859C10.0514 1.05859 10.4762 1.47538 10.4762 1.98767C10.4762 2.49998 10.0514 2.91677 9.52932 2.91677C9.00721 2.91677 8.58246 2.49998 8.58246 1.98767C8.58246 1.47538 9.00721 1.05859 9.52932 1.05859ZM0.637512 7.84162H3.10233C3.29882 8.62064 4.01695 9.2 4.87073 9.2C5.72452 9.2 6.44265 8.62064 6.63914 7.84162H13.7625C14.0041 7.84162 14.2 7.64941 14.2 7.41233C14.2 7.17525 14.0041 6.98303 13.7625 6.98303H6.63911C6.44262 6.20402 5.72449 5.62463 4.87071 5.62463C4.01693 5.62463 3.2988 6.20402 3.10231 6.98303H0.637512C0.395903 6.98303 0.200012 7.17525 0.200012 7.41233C0.200012 7.64941 0.395875 7.84162 0.637512 7.84162ZM4.87071 6.48323C5.39281 6.48323 5.81757 6.90002 5.81757 7.41233C5.81757 7.92461 5.39281 8.3414 4.87071 8.3414C4.34861 8.3414 3.92385 7.92461 3.92385 7.41233C3.92385 6.90002 4.34861 6.48323 4.87071 6.48323Z" fill="currentColor" stroke="currentColor" strokeWidth="0.4" />
    </svg>
  );
}

function RecentSortIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.89404 8.62232L9.41021 11.1385C9.65587 11.3841 10.0541 11.3841 10.2998 11.1385L12.8159 8.62232C13.0616 8.37666 13.0616 7.97843 12.8159 7.73277C12.5703 7.48711 12.172 7.48711 11.9264 7.73277L10.484 9.17504V0.629042C10.484 0.281635 10.2024 0 9.85499 0C9.50759 0 9.22594 0.281635 9.22594 0.629042V9.17504L7.78359 7.73277C7.53793 7.48711 7.13971 7.48711 6.89404 7.73277C6.64838 7.97843 6.64838 8.37666 6.89404 8.62232ZM3.59001 0.184242C3.34435 -0.0614114 2.94606 -0.0614114 2.70041 0.184242L0.18424 2.70041C-0.0614134 2.94606 -0.0614134 3.34435 0.18424 3.59001C0.429893 3.83566 0.828186 3.83566 1.07384 3.59001L2.51617 2.14768V10.6937C2.51617 11.0411 2.7978 11.3228 3.14521 11.3228C3.49261 11.3228 3.77425 11.0411 3.77425 10.6937V2.14768L5.2166 3.59001C5.46226 3.83566 5.86049 3.83566 6.10615 3.59001C6.35181 3.34435 6.35181 2.94606 6.10615 2.70041L3.59001 0.184242Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FilterBar({
  cardFilters = ['all'],
  onCardFiltersChange,
  sortBy = 'recent',
  onSortChange,
  mode,
  onModeChange,
}: FilterBarProps) {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const filterLabel = getFilterLabel(cardFilters);
  const currentSort = SORT_ICONS.find((o) => o.id === sortBy) ?? SORT_ICONS[0];

  const handleFiltersChange = (filters: CardFilterType[]) => {
    onCardFiltersChange?.(filters);
  };

  return (
    <>
      <div className="px-3 pr-4 py-2 space-y-3">

        <div className="flex items-center relative z-10 justify-between gap-2">
          <AnimatedToggle value={mode} onChange={onModeChange} />

          <div className="flex items-center gap-2 relative">
            <span className="text-sm text-text-primary mr-1">Filters</span>

            <button
              type="button"
              aria-label={filterLabel}
              onClick={(e) => {
                e.stopPropagation();
                setFilterDropdownOpen((prev) => !prev);
                setSortDropdownOpen(false);
              }}
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-3 py-2 text-sm hover:bg-black/5 active:scale-95 transition"
            >
              <FilterIcon className="w-4 h-4 text-text-primary" />
            </button>

            <button
              type="button"
              aria-label={currentSort.label}
              onClick={(e) => {
                e.stopPropagation();
                setSortDropdownOpen((prev) => !prev);
                setFilterDropdownOpen(false);
              }}
              className="inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm transition active:scale-95 border-border bg-white p-2 hover:bg-black/5/60"
            >
              <currentSort.Icon className="w-4 h-4 text-text-primary" />
            </button>
          </div>
        </div>
        {/* <div className="flex items-center justify-center">

          <Link
            href={mode === 'virtual' ? '/add-instacard' : '/add-universal-card'}
            onClick={() => useCardWalletStore.getState().setPendingCardForm(mode)}

            className="flex items-center bg-primary text-white rounded-full justify-center gap-2 w-full px-4 py-3"
            aria-label="Add Instacard"
          >
            <Plus className='w-5 h-5 text-white' />
            <span className="text-white text-sm font-medium">Add {mode === 'virtual' ? 'Virtual Card' : 'Universal Card'}</span>
          </Link>
        </div> */}
      </div>

      <FilterDropdown
        open={filterDropdownOpen}
        onOpenChange={setFilterDropdownOpen}
        selectedFilters={cardFilters}
        onSelectionChange={handleFiltersChange}
      />
      <SortDropdown
        open={sortDropdownOpen}
        onOpenChange={setSortDropdownOpen}
        selectedSort={sortBy}
        onSelect={(value) => {
          onSortChange?.(value);
          setSortDropdownOpen(false);
        }}
      />
    </>
  );
}

interface AnimatedToggleProps {
  value: ModeValue;
  onChange: (value: ModeValue) => void;
}

function AnimatedToggle({ value, onChange }: AnimatedToggleProps) {
  const activeIndex = value === 'virtual' ? 0 : 1;

  return (
    <div
      dir="ltr"
      className="relative inline-flex  items-center bg-white border border-border rounded-full p-1 gap-1 min-w-[160px]"
      role="tablist"
    >
      <div

        className={`absolute top-1/2 left-[2%] -translate-y-1/2 w-[45%] h-[85%]   rounded-full bg-primary transition-transform duration-200`}
        style={{
          transform: `translateX(${activeIndex * 112}%)`,
        }}
      />
      {TOGGLE_OPTIONS.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className="relative flex-1 py-1.5 text-xs font-medium rounded-full z-10"
            role="tab"
            aria-selected={isActive}
          >
            <span
              className={
                isActive ? 'text-text-on-primary' : 'text-text-secondary'
              }
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface FilterDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFilters: CardFilterType[];
  onSelectionChange: (filters: CardFilterType[]) => void;
}

function FilterDropdown({
  open,
  onOpenChange,
  selectedFilters,
  onSelectionChange,
}: FilterDropdownProps) {
  if (!open) return null;

  const toggleFilter = (filter: CardFilterType) => {
    if (filter === 'all') {
      onSelectionChange(['all']);
      return;
    }

    let next: CardFilterType[] = selectedFilters.filter((f) => f !== 'all');

    if (next.includes(filter)) {
      next = next.filter((f) => f !== filter);
      if (next.length === 0) {
        next = ['all'];
      }
    } else {
      next = [...next, filter];
    }

    onSelectionChange(next);
  };

  return (
    <div className="fixed inset-0 h-dvh bg-black/10 z-40" onClick={() => onOpenChange(false)}>
      <div
        className="absolute right-4 top-[25%] backdrop-blur-md  min-w-[260px] rounded-2xl bg-white/80  border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between  px-4 pt-3 pb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-text-primary" />
            <span className="text-sm font-semibold text-text-primary">
              Filters
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close filters"
            className="p-1 rounded-full hover:bg-black/5"
          >
            <X className="w-4 h-4 text-text-primary" />
          </button>
        </div>

        <div className="px-5 py-3 space-y-2">
          {FILTER_OPTIONS.map((option) => {
            const isSelected = selectedFilters.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleFilter(option.id)}
                className="flex w-full items-center justify-between py-1.5 text-left text-sm"
                aria-pressed={isSelected}
              >
                <span className="text-text-primary">{option.label}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border text-[10px] ${isSelected
                    ? 'bg-primary border-primary text-[#fff]'
                    : 'border-text-primary text-transparent'
                    }`}
                >
                  <Check className="w-3 h-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SortDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSort: SortByValue;
  onSelect?: (sort: SortByValue) => void;
}

function SortDropdown({
  open,
  onOpenChange,
  selectedSort,
  onSelect,
}: SortDropdownProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 h-dvh bg-black/10 z-40"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="absolute right-4 top-[25%] backdrop-blur-md min-w-[220px] rounded-2xl bg-white/80 border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/40">
          <span className="text-sm font-semibold text-text-primary">
            Sort by
          </span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close sort"
            className="p-1 rounded-full hover:bg-black/5"
          >
            <X className="w-4 h-4 text-text-primary" />
          </button>
        </div>

        <div className="px-4 py-3 space-y-1.5">
          {SORT_ICONS.map(({ id, Icon, label }) => {
            const isActive = selectedSort === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect?.(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-left transition-colors ${isActive ? 'bg-primary/5 text-primary' : 'hover:bg-black/5'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
