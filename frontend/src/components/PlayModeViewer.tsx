import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/useStoryStore';
import { PlayMode } from './story-view/PlayMode';
import { Navigation } from './Navigation';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PlayModeViewer: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentStory, setCurrentStory } = useStoryStore();

  const handleExit = () => {
    navigate(`/story/${id}`);
  };

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          handleExit();
        }
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  if (!currentStory) return null;

  const currentPageData = currentStory.pages[currentStory.currentPage];

  const handlePlayAudio = () => {
    console.log('Playing audio for page:', currentPageData.id);
  };

  return (
    <div 
      className="fixed inset-0 bg-black"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 z-50 flex gap-2"
          >
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 
                       transition-colors text-white"
            >
              {isFullscreen ? (
                <Minimize2 className="w-6 h-6" />
              ) : (
                <Maximize2 className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={handleExit}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 
                       transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentStory.currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <PlayMode
            page={currentPageData}
            onExit={handleExit}
            onPlayAudio={handlePlayAudio}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Navigation
          onPrevious={() => useStoryStore.getState().previousPage()}
          onNext={() => useStoryStore.getState().nextPage()}
          canGoPrevious={currentStory.currentPage > 0}
          canGoNext={currentStory.currentPage < currentStory.pages.length - 1}
          theme="dark"
        />
      </div>
    </div>
  );
}; 