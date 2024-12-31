import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Calendar, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStoryStore } from '../stores/useStoryStore';
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';
import { Story } from '../types/story';

const formatRelativeDate = (date: Date) => {
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  const distance = formatDistanceToNow(date, { addSuffix: true });
  // If it's within the last week, show relative time
  if (distance.includes('days ago') && parseInt(distance) <= 7) {
    return distance;
  }
  // Otherwise show the date
  return format(date, 'MMM d, yyyy');
};

const calculateProgress = (story: Story) => {
  if (story.status !== 'GENERATING') return null;

  let totalAssets = 0;
  let completedAssets = 0;

  story.pages.forEach(page => {
    // Count audio
    totalAssets++;
    if (page.audioStatus === 'GENERATED') completedAssets++;

    // Count images
    page.panels.forEach(panel => {
      totalAssets++;
      if (panel.imageStatus === 'GENERATED') completedAssets++;
    });
  });

  return Math.round((completedAssets / totalAssets) * 100);
};

export const StoryLibrary: React.FC = () => {
  const { stories, fetchStories, isLoading } = useStoryStore();

  const handleRefresh = async () => {
    await fetchStories();
  };

  // Sort stories: Completed first, then Generating, then Failed
  const sortedStories = [...stories].sort((a, b) => {
    const statusOrder = { 'COMPLETED': 0, 'GENERATING': 1, 'FAILED': 2 };
    return statusOrder[a.status] - statusOrder[b.status] || 
           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Your Stories</h2>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-purple-50 text-purple-600
                     transition-colors disabled:opacity-50"
        >
          <RefreshCw 
            className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={story.status === 'COMPLETED' ? { scale: 1.02 } : undefined}
            className={`bg-white rounded-xl shadow-md overflow-hidden 
                       ${story.status === 'COMPLETED' ? 'cursor-pointer' : ''}
                       ${story.status !== 'COMPLETED' ? 'opacity-75' : ''}`}
            onClick={() => {
              if (story.status === 'COMPLETED') {
                window.location.href = `/story/${story.id}`;
              }
            }}
          >
            <div className={`relative ${story.status !== 'COMPLETED' ? 'aspect-video sm:aspect-[2/1]' : 'aspect-video'}`}>
              {story.pages[0]?.panels[0]?.imageUrl && (
                <>
                  <img
                    src={story.pages[0].panels[0].imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </>
              )}
              <div className="absolute top-3 right-3">
                {story.status === 'GENERATING' && (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                                bg-white/90 text-purple-600 text-sm shadow-sm">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="font-medium">
                        {calculateProgress(story)}% Complete
                      </span>
                    </div>
                    <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-600 transition-all duration-300 ease-out"
                        style={{ width: `${calculateProgress(story)}%` }}
                      />
                    </div>
                  </div>
                )}
                {story.status === 'FAILED' && (
                  <div className="px-2.5 py-1 rounded-full bg-white/90 
                                text-red-600 text-sm font-medium shadow-sm">
                    Failed
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{story.title}</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Book className="w-4 h-4" />
                  <span>{story.pages.length} pages</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatRelativeDate(new Date(story.createdAt))}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};