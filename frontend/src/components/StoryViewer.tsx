import React, { useState, useCallback, useEffect } from 'react';
import { useStoryStore } from '../stores/useStoryStore';
import { PlayMode } from './story-view/PlayMode';
import { EditMode } from './story-view/EditMode';
import { Navigation } from './Navigation';
import { X, Maximize2, Minimize2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewModeStore } from '../stores/useViewModeStore';
import { useNavigate } from 'react-router-dom';

export const StoryViewer: React.FC = () => {
  const { mode: viewMode, setMode: setViewMode } = useViewModeStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const { currentStory, updatePage } = useStoryStore();
  const navigate = useNavigate();

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
      if (event.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  if (!currentStory) {
    return null;
  }

  const currentPageData = currentStory.pages[currentStory.currentPage];

  const handlePlayAudio = () => {
    console.log('Playing audio for page:', currentPageData.id);
  };

  if (viewMode === 'play') {
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
                onClick={() => setViewMode('edit')}
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
              onExit={() => setViewMode('edit')}
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-purple-100">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-purple-900">{currentStory.title}</h1>
            </div>
            <button
              onClick={() => navigate(`/story/play/${currentStory.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg
                       hover:bg-purple-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Play Story
            </button>
          </div>
        </div>
      </header>

      <main className="py-8">
        <EditMode page={currentPageData} onUpdatePage={updatePage} />
      </main>
    </div>
  );
};