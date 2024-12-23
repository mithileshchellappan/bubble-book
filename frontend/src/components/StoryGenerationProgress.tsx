import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStoryStore } from '../stores/useStoryStore';
import { usePresetVoiceStore } from '../stores/usePresetVoiceStore';

interface StoryGenerationProgressProps {
  draft: any;
  voiceId: string;
  voiceStyle: string;
  onComplete: () => void;
}

export const StoryGenerationProgress: React.FC<StoryGenerationProgressProps> = ({
  draft,
  voiceId,
  voiceStyle,
  onComplete
}) => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const generateFullStory = useStoryStore(state => state.generateFullStory);

  const hasStartedGeneration = useRef(false);

  React.useEffect(() => {
    const generateStory = async () => {
      if (hasStartedGeneration.current) return;
      hasStartedGeneration.current = true;

      try {
        await generateFullStory();
        setIsSubmitted(true);
        onComplete();
      } catch (error) {
        console.error('Failed to generate story:', error);
      }
    };

    generateStory();
  }, [generateFullStory]);

  const handleGoToLibrary = () => {
    useStoryStore.setState({ currentDraft: null });
    usePresetVoiceStore.setState({ selectedVoice: null, selectedStyle: '' });
    navigate('/library');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto p-8 text-center"
    >
      <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Creating Your Story</h2>
      <p className="text-gray-600">
        We're working on bringing your story to life with beautiful images and narration. 
        This process may take a few minutes.
      </p>
      <p className="text-gray-600 mt-4">
        You can check the progress in your story library.
      </p>

      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <button
            onClick={handleGoToLibrary}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 
                     text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Library
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}; 