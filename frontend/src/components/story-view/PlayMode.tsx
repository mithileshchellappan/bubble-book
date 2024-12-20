import React from 'react';
import { StoryPage } from '../../types/story';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface PlayModeProps {
  page: StoryPage;
  onPlayAudio: () => void;
  onExit: () => void;
}

export const PlayMode: React.FC<PlayModeProps> = ({ page, onPlayAudio }) => {
  const [isMuted, setIsMuted] = React.useState(false);

  return (
    <div className="relative w-full h-screen bg-black">
      <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
        {page.panels.map((panel) => (
          <motion.div
            key={panel.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <img 
              src={panel.imageUrl} 
              alt={panel.imagePrompt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <p className="text-white text-lg flex-1 text-center">
            {page.text}
          </p>
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted) onPlayAudio();
            }}
            className="ml-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};