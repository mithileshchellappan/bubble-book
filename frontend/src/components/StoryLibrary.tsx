import React from 'react';
import { useStoryStore } from '../stores/useStoryStore';
import { motion } from 'framer-motion';
import { Book, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Story } from '../types/story';

export const StoryLibrary: React.FC = () => {
  const { stories, setCurrentStory } = useStoryStore();
  const navigate = useNavigate();

  const handleStoryClick = (story: Story) => {
    setCurrentStory(story);
    navigate(`/story/${story.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-900">Your Stories</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-xl shadow-md cursor-pointer"
            onClick={() => handleStoryClick(story)}
          >
            <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <img
                src={story.pages[0].panels[0].imageUrl}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{story.title}</h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Book className="w-4 h-4" />
              <span className="capitalize">{story.genre}</span>
              <span className="mx-1">•</span>
              <span className="capitalize">{story.theme}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(story.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {stories.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No stories yet. Create your first story!</p>
        </div>
      )}
    </div>
  );
};