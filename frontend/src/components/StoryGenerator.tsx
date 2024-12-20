import React, { useState } from 'react';
import { Genre, Theme } from '../types/story';
import { useStoryStore } from '../stores/useStoryStore';
import { Wand2, Sparkles } from 'lucide-react';
import { Chip } from './ui/Chip';
import { genreEmojis, themeEmojis } from '../constants/genres';
import { motion } from 'framer-motion';
import { StoryDraftPreview } from './StoryDraftPreview';
import { VoiceSelector } from './voice/VoiceSelector';
import { presetVoices } from '../constants/voices';
import { Voice } from '../types/voice';
import { useVoiceStore } from '../stores/useVoiceStore';

const genres: Genre[] = ['fantasy', 'adventure', 'educational', 'bedtime', 'fairy-tale'];
const themes: Theme[] = ['nature', 'animals', 'space', 'ocean', 'friendship', 'family'];

export const StoryGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [pageCount, setPageCount] = useState(3);
  const [selectedVoice, setSelectedVoice] = useState<Voice | undefined>();
  const { customVoices } = useVoiceStore();
  const { 
    generateDraft, 
    generateFullStory,
    clearDraft,
    currentDraft,
    isDraftGenerating,
    isGenerating
  } = useStoryStore();

  const handleGenerate = async () => {
    if (!selectedGenre || !selectedTheme) return;
    await generateDraft(prompt, selectedGenre, selectedTheme, pageCount);
  };

  const handleApprove = async () => {
    await generateFullStory();
  };

  const handleReject = () => {
    clearDraft();
  };

  if (currentDraft) {
    return (
      <StoryDraftPreview
        draft={currentDraft}
        onApprove={handleApprove}
        onReject={handleReject}
        isGenerating={isGenerating}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl m-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Create a Magical Story
        </h2>
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Story Prompt (optional)
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-300
                   transition-colors resize-none shadow-sm"
          placeholder="Once upon a time..."
          rows={4}
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Pages
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="10"
            value={pageCount}
            onChange={(e) => setPageCount(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <span className="text-sm font-medium text-gray-700 min-w-[2rem]">
            {pageCount}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose a Genre
        </label>
        <div className="flex flex-wrap gap-3">
          {genres.map(genre => (
            <Chip
              key={genre}
              label={genre}
              emoji={genreEmojis[genre]}
              selected={genre === selectedGenre}
              onClick={() => setSelectedGenre(genre)}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Pick a Theme
        </label>
        <div className="flex flex-wrap gap-3">
          {themes.map(theme => (
            <Chip
              key={theme}
              label={theme}
              emoji={themeEmojis[theme]}
              selected={theme === selectedTheme}
              onClick={() => setSelectedTheme(theme)}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Narration Voice
        </label>
        <VoiceSelector
          selectedVoice={selectedVoice}
          onVoiceSelect={setSelectedVoice}
          customVoices={customVoices}
          presetVoices={presetVoices}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        disabled={isDraftGenerating || !selectedGenre || !selectedTheme}
        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl
                 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-3 transition-all"
      >
        <Wand2 className="w-5 h-5" />
        {isDraftGenerating ? 'Creating Draft...' : 'Create Story'}
      </motion.button>
    </motion.div>
  );
};