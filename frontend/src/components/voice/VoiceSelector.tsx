import React, { useState, useEffect, useRef } from 'react';
import { Mic, Check, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresetVoiceStore } from '../../stores/usePresetVoiceStore';

interface VoiceSelectorProps {
  onVoiceSelect?: (voiceId: string, style: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ onVoiceSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    voices, 
    selectedVoice, 
    selectedStyle,
    isLoading,
    loadVoices, 
    setSelectedVoice, 
    setSelectedStyle,
    synthesizeSpeech
  } = usePresetVoiceStore();

  useEffect(() => {
    loadVoices();
  }, [loadVoices]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 border rounded-lg
                 hover:border-purple-300 focus:ring-2 focus:ring-purple-500 bg-white"
      >
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">
            {selectedVoice ? `${selectedVoice.name}${selectedStyle ? ` (${selectedStyle})` : ''}` : 'Select a voice'}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full bottom-full mb-2 bg-white rounded-xl shadow-lg py-2 max-h-80 overflow-y-auto"
          >
            {voices.map((voice) => (
              <VoiceOption
                key={voice.id}
                voice={voice}
                isSelected={selectedVoice?.id === voice.id}
                onSelect={() => {
                  setSelectedVoice(voice);
                  setSelectedStyle('');
                  if (onVoiceSelect) {
                    onVoiceSelect(voice.id, '');
                  }
                  setIsOpen(false);
                }}
                onStyleSelect={(style) => {
                  setSelectedStyle(style);
                  if (onVoiceSelect) {
                    onVoiceSelect(voice.id, style);
                  }
                }}
                onPreview={(text) => synthesizeSpeech(text, voice.id, selectedStyle)}
                selectedStyle={selectedVoice?.id === voice.id ? selectedStyle : ''}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface VoiceOptionProps {
  voice: {
    id: string;
    name: string;
    styles: string[];
    gender: string;
    sampleAudioUrl: string;
  };
  isSelected: boolean;
  selectedStyle: string;
  onSelect: () => void;
  onStyleSelect: (style: string) => void;
  onPreview: (text: string) => void;
}

const VoiceOption: React.FC<VoiceOptionProps> = ({ 
  voice, 
  isSelected, 
  selectedStyle,
  onSelect, 
  onStyleSelect,
  onPreview 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStyles, setShowStyles] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for sample
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
    <div className="border-b last:border-b-0">
      <button
        onClick={() => {
          onSelect();
          setShowStyles(voice.styles.length > 0);
        }}
        className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center justify-between group"
      >
        <div className="flex-1">
          <div className="font-medium text-gray-900">{voice.name}</div>
          <div className="text-sm text-gray-500">{voice.gender}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayAudio}
            className={`p-2 rounded-full transition-colors ${
              isPlaying 
                ? 'bg-purple-100 text-purple-600' 
                : 'text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          </button>
          {isSelected && <Check className="w-4 h-4 text-purple-600" />}
        </div>
      </button>

      {isSelected && showStyles && voice.styles.length > 0 && (
        <div className="px-4 py-2 bg-gray-50">
          <div className="text-sm font-medium text-gray-700 mb-2">Voice Styles</div>
          <div className="flex flex-wrap gap-2">
            {voice.styles.map((style) => (
              <button
                key={style}
                onClick={() => {
                  onStyleSelect(style);
                  onPreview(`Let me demonstrate the ${style} style.`);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedStyle === style
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 border hover:border-purple-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 