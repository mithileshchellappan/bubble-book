import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStoryStore } from '../stores/useStoryStore';

export const StoryLibrary: React.FC = () => {
  const { stories, fetchStories, isLoading, error } = useStoryStore();

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Stories</h2>
      
      {stories.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          No stories yet. Start creating one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {story.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Book className="w-4 h-4" />
                  <span>{story.pages?.length || 0} pages</span>
                </div>
                
                {story.status === 'GENERATING' && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </div>
                )}
                
                {story.status === 'COMPLETED' && (
                  <Link
                    to={`/story/${story.id}`}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700"
                  >
                    View Story →
                  </Link>
                )}

                {story.status === 'FAILED' && (
                  <div className="text-red-600">
                    Generation failed
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};