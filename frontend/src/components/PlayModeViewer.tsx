import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/useStoryStore';
import { PlayMode } from './story-view/PlayMode';
import { Navigation } from './Navigation';
import { X, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PlayModeViewer: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentStory, fetchStoryById, currentPage } = useStoryStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (id) {
      fetchStoryById(id);
    }
  }, [id, fetchStoryById]);

  const handleExit = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
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

  const currentPageData = currentStory.pages[currentPage];

  useEffect(() => {
    if (audioRef.current && currentPageData.audioUrl) {
      audioRef.current.currentTime = 0;
      if (isAudioPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentPageData.audioUrl, isAudioPlaying]);

  const handlePlayAudio = () => {
    if (!audioRef.current || !currentPageData.audioUrl) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  const handleNextPage = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
    useStoryStore.getState().nextPage();
  };

  const handlePreviousPage = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
    useStoryStore.getState().previousPage();
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
            {currentPageData.audioUrl && (
              <button
                onClick={handlePlayAudio}
                className="p-2 rounded-full bg-black/20 hover:bg-black/30 
                         transition-colors text-white"
              >
                {isAudioPlaying ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
            )}
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

      {currentPageData.audioUrl && (
        <audio
          ref={audioRef}
          src={currentPageData.audioUrl}
          onEnded={() => setIsAudioPlaying(false)}
          onError={() => setIsAudioPlaying(false)}
          className="hidden"
        />
      )}

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentPage}
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
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          canGoPrevious={currentPage > 0}
          canGoNext={currentPage < currentStory.pages.length - 1}
          theme="dark"
        />
      </div>
    </div>
  );
}; 