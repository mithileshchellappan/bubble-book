import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Clock } from 'lucide-react';
import { useStoryStore } from '../stores/useStoryStore';

const IMAGES_BEFORE_COOLDOWN = 3;
const COOLDOWN_SECONDS = 30;

interface StoryGenerationProgressProps {
  onComplete: () => void;
}

export const StoryGenerationProgress: React.FC<StoryGenerationProgressProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { currentDraft } = useStoryStore();
  const [imagesGenerated, setImagesGenerated] = useState(0);

  useEffect(() => {
    if (!currentDraft) return;

    const totalPanels = currentDraft.pages.reduce((acc, page) => acc + page.panels.length, 0);
    const progressPerPanel = 100 / totalPanels;
    let completedPanels = 0;

    const generateImages = async () => {
      for (const page of currentDraft.pages) {
        for (const panel of page.panels) {
          if (imagesGenerated >= IMAGES_BEFORE_COOLDOWN) {
            // Start cooldown
            setCooldownTime(COOLDOWN_SECONDS);
            const cooldownInterval = setInterval(() => {
              setCooldownTime(prev => {
                if (prev <= 1) {
                  clearInterval(cooldownInterval);
                  setImagesGenerated(0);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);

            // Wait for cooldown
            await new Promise(resolve => setTimeout(resolve, COOLDOWN_SECONDS * 1000));
          }

          await fetch('http://localhost:4000/api/images/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await window.Clerk?.session?.getToken()}`
            },
            body: JSON.stringify({ prompt: panel.imagePrompt })
          });

          completedPanels++;
          setImagesGenerated(prev => prev + 1);
          setProgress(Math.round(completedPanels * progressPerPanel));
        }
      }
      onComplete();
    };

    generateImages();
  }, [currentDraft, onComplete]);

  return (
    <div className="fixed inset-0 bg-purple-900/50 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-center mb-6">
          {cooldownTime > 0 ? (
            <Clock className="w-8 h-8 text-orange-500" />
          ) : (
            <Wand2 className="w-8 h-8 text-purple-600 animate-pulse" />
          )}
        </div>
        <h2 className="text-xl font-bold text-center mb-2">
          {cooldownTime > 0 ? 'Cooling Down...' : 'Generating Your Story'}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {cooldownTime > 0 
            ? `Waiting ${cooldownTime}s before generating more images...` 
            : 'Please wait while we create your magical story...'}
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full"
          />
        </div>
        <p className="text-sm text-gray-500 text-center">{progress}% complete</p>
      </motion.div>
    </div>
  );
}; 