import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Heart, Check } from 'lucide-react';
import { usePresetVoiceStore } from '../../stores/usePresetVoiceStore';

interface VoiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (voiceId: string, style: string) => void;
}

export const VoiceSelectionModal: React.FC<VoiceSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const { 
    voices, 
    selectedVoice, 
    selectedStyle,
    isLoading,
    loadVoices, 
    setSelectedVoice, 
    setSelectedStyle 
  } = usePresetVoiceStore();

  React.useEffect(() => {
    if (isOpen) {
      loadVoices();
    }
  }, [isOpen, loadVoices]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Choose a Voice</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Grid */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {voices.map((voice) => (
                <VoiceCard
                  key={voice.id}
                  voice={voice}
                  isSelected={selectedVoice?.id === voice.id}
                  selectedStyle={selectedStyle}
                  onSelect={() => setSelectedVoice(voice)}
                  onStyleSelect={setSelectedStyle}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedVoice) {
                    onConfirm(selectedVoice.id, selectedStyle);
                  }
                }}
                disabled={!selectedVoice}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                          disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Voice
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface VoiceCardProps {
  voice: {
    id: string;
    name: string;
    gender: string;
    styles: string[];
    sampleAudioUrl: string;
  };
  isSelected: boolean;
  selectedStyle: string;
  onSelect: () => void;
  onStyleSelect: (style: string) => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  isSelected,
  selectedStyle,
  onSelect,
  onStyleSelect
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(voice.sampleAudioUrl);
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        audioRef.current = null;
      }
    };
  }, [voice.sampleAudioUrl]);

  const handlePlayAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      try {
        setIsPlaying(true);
        await audioRef.current.play();
      } catch (error) {
        console.error('Error playing sample:', error);
        setIsPlaying(false);
      }
    }
  };

  return (
    <div 
      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer
        ${isSelected 
          ? 'border-purple-600 bg-purple-50/50' 
          : 'border-gray-200 hover:border-purple-300 bg-white'}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{voice.name}</h3>
          <p className="text-sm text-gray-500">{voice.gender}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayAudio}
            className={`p-2 rounded-full transition-colors ${
              isPlaying ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {voice.styles.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-500 mb-2">
            {voice.styles.length} styles
          </div>
          <div className="flex flex-wrap gap-2">
            {voice.styles.map((style) => (
              <button
                key={style}
                onClick={(e) => {
                  e.stopPropagation();
                  onStyleSelect(style);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                  ${selectedStyle === style && isSelected
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      )}

      {isSelected && (
        <div className="absolute top-2 right-2">
          <Check className="w-5 h-5 text-purple-600" />
        </div>
      )}
    </div>
  );
}; 