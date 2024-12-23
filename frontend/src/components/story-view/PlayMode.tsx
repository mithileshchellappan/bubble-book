import React, { useState, useEffect } from 'react';
import { StoryPage } from '../../types/story';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStoryStore } from '../../stores/useStoryStore';

interface PlayModeProps {
  page: StoryPage;
  onPlayAudio: () => void;
  onExit: () => void;
}

export const PlayMode: React.FC<PlayModeProps> = ({ page, onPlayAudio, onExit }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const { currentPage, currentStory } = useStoryStore();

  const canGoNext = currentStory && currentPage < currentStory.pages.length - 1;
  const canGoPrevious = currentStory && currentPage > 0;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canGoNext) {
      useStoryStore.getState().nextPage();
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canGoPrevious) {
      useStoryStore.getState().previousPage();
    }
  };

  useEffect(() => {
    if (!isMuted) {
      onPlayAudio();
    }
  }, [isMuted]);

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden"
      onClick={() => setShowControls(true)}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Navigation Areas with Hover Indicators */}
      {canGoPrevious && (
        <div 
          className="absolute left-0 top-0 w-[15%] h-full z-30 cursor-pointer
                     group flex items-center justify-start"
          onClick={handlePrevious}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 1 : 0 }}
            className="p-4 bg-black/20 rounded-r-full group-hover:bg-black/40 transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      )}
      {canGoNext && (
        <div 
          className="absolute right-0 top-0 w-[15%] h-full z-30 cursor-pointer
                     group flex items-center justify-end"
          onClick={handleNext}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 1 : 0 }}
            className="p-4 bg-black/20 rounded-l-full group-hover:bg-black/40 transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      )}

      {/* Page Content with Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="w-full h-full"
        >
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 p-1">
            {page.panels.map((panel, index) => (
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1 
                }}
                className="relative overflow-hidden bg-black"
              >
                <img
                  src={panel.imageUrl}
                  alt={`Panel ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Text Overlay - Always Visible */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-white text-lg max-w-3xl mx-auto text-center">
            {page.text}
          </p>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 flex gap-2 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};