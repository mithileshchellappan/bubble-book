import React, { useEffect, useState } from 'react';
import { StoryDraft } from '../types/story';
import { motion } from 'framer-motion';
import { Wand2, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStoryStore } from '../stores/useStoryStore';
import { StoryGenerationProgress } from './StoryGenerationProgress';

interface StoryDraftPreviewProps {
  draft: StoryDraft;
  onApprove: () => void;
  onReject: () => void;
  isGenerating: boolean;
}

export const StoryDraftPreview: React.FC<StoryDraftPreviewProps> = ({
  draft,
  onApprove,
  onReject,
  isGenerating
}) => {
  const [showProgress, setShowProgress] = useState(false);
  const navigate = useNavigate();

  const handleApproveClick = async () => {
    setShowProgress(true);
    await onApprove();
    setTimeout(() => {
      const storyId = useStoryStore.getState().currentStory?.id;
      if (storyId) {
        navigate(`/story/${storyId}`);
      }
    }, 100);
  };

  if (showProgress) {
    return <StoryGenerationProgress onComplete={() => setShowProgress(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-purple-900">{draft.title}</h3>
        <span className="text-sm text-gray-500">
          {draft.pages.length} {draft.pages.length === 1 ? 'page' : 'pages'}
        </span>
      </div>

      <div className="space-y-6">
        {draft.pages.map((page, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Page {index + 1}</h4>
            <p className="text-gray-600 mb-4">{page.text}</p>
            <div className="grid grid-cols-4 gap-4">
              {page.panels.map((panel, panelIndex) => (
                <div 
                  key={panelIndex} 
                  className="bg-gradient-to-br from-purple-50 to-blue-50 
                           border border-purple-100 p-4 rounded-lg"
                >
                  <h5 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                      Image Panel {panelIndex + 1}
                    </span>
                  </h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{panel.imagePrompt}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReject}
          className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl
                   font-medium hover:bg-gray-200 flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" />
          Try Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApproveClick}
          disabled={isGenerating}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 
                   text-white rounded-xl font-medium shadow-lg
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Wand2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Looks Good!
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};