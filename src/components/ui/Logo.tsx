import React from 'react';
import { Sparkles } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Sparkles className="w-8 h-8 text-purple-600" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Bubble Book
      </span>
    </div>
  );
};