import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  theme?: 'light' | 'dark';
}

export const Navigation: React.FC<NavigationProps> = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  theme = 'light'
}) => {
  const baseButtonClass = `p-3 rounded-full transition-all
    ${theme === 'dark' 
      ? 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20 disabled:bg-white/5' 
      : 'text-gray-600 hover:text-purple-600 bg-white hover:bg-purple-50 disabled:bg-gray-100'
    }
    disabled:cursor-not-allowed disabled:opacity-50`;

  return (
    <div className="flex items-center gap-4">
      {/* <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={baseButtonClass}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={baseButtonClass}
      >
        <ChevronRight className="w-6 h-6" />
      </button> */}
    </div>
  );
};