import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StoryGenerationProgressProps {
  onComplete: () => void;
}

export const StoryGenerationProgress: React.FC<StoryGenerationProgressProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-purple-900/50 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-center mb-6">
          <Wand2 className="w-8 h-8 text-purple-600 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-center mb-2">Generating Your Story</h2>
        <p className="text-gray-600 text-center mb-6">Please wait while we create your magical story...</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full"
          />
        </div>
        <p className="text-sm text-gray-500 text-center">{progress}% complete</p>
      </motion.div>
    </div>
  );
}; 