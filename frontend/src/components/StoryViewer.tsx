import React, { useState } from 'react';
import { PlayMode } from './story-view/PlayMode';
import { EditMode } from './story-view/EditMode';
import { useStoryStore } from '../stores/useStoryStore';
import { Navigation } from './Navigation';
import { Play, BookOpen, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const StoryViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'play' | 'edit'>('edit');
  const { currentStory, updatePage } = useStoryStore();

  if (!currentStory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center">
          <BookOpen className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Story Selected</h2>
          <p className="text-gray-600 mb-4">Please select a story from your library or create a new one.</p>
          <div className="space-y-3">
            <Link
              to="/create"
              className="block w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create New Story
            </Link>
            <Link
              to="/"
              className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentPageData = currentStory.pages[currentStory.currentPage];

  const handlePlayAudio = () => {
    console.log('Playing audio for page:', currentPageData.id);
  };

  if (viewMode === 'play') {
    return (
      <div className="fixed inset-0 bg-black">
        <button
          onClick={() => setViewMode('edit')}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 hover:bg-black/30 
                   transition-colors text-white"
        >
          <X className="w-6 h-6" />
        </button>

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
              onClick={() => setViewMode('play')}
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