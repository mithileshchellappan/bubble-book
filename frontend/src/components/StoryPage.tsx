import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface StoryPageProps {
  imageUrl: string;
  text: string;
  onPlayAudio: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ imageUrl, text, onPlayAudio }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto p-4"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <img
          src={imageUrl}
          alt="Story illustration"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex items-start gap-4">
            <p className="text-white text-lg flex-1">{text}</p>
            <button
              onClick={onPlayAudio}
              className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-full"
            >
              <Volume2 className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};