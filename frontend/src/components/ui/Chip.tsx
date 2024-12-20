import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface ChipProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onClick: () => void;
}

export const Chip: React.FC<ChipProps> = ({ label, emoji, selected, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-full text-sm font-medium transition-colors',
        'hover:bg-purple-100 flex items-center gap-2',
        'border-2 shadow-sm',
        selected
          ? 'bg-purple-600 text-white hover:bg-purple-700 border-purple-700'
          : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
      )}
    >
      {emoji && <span className="text-lg">{emoji}</span>}
      <span className="capitalize">{label}</span>
    </motion.button>
  );
};