import React, { useState } from 'react';
import { Mic, Check, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Voice {
  id: string;
  name: string;
  description: string;
  previewUrl?: string;
  isCustom?: boolean;
}

interface VoiceSelectorProps {
  selectedVoice?: Voice;
  onVoiceSelect: (voice: Voice) => void;
  customVoices: Voice[];
  presetVoices: Voice[];
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceSelect,
  customVoices,
  presetVoices
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
            {selectedVoice ? selectedVoice.name : 'Select a voice'}
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
            {/* Custom Voices */}
            {customVoices.length > 0 && (
              <>
                <div className="px-4 py-1">
                  <h3 className="text-sm font-medium text-gray-500">Custom Voices</h3>
                </div>
                {customVoices.map((voice) => (
                  <VoiceOption
                    key={voice.id}
                    voice={voice}
                    isSelected={selectedVoice?.id === voice.id}
                    onSelect={() => onVoiceSelect(voice)}
                  />
                ))}
                <div className="border-t my-2" />
              </>
            )}

            {/* Preset Voices */}
            <div className="px-4 py-1">
              <h3 className="text-sm font-medium text-gray-500">Preset Voices</h3>
            </div>
            {presetVoices.map((voice) => (
              <VoiceOption
                key={voice.id}
                voice={voice}
                isSelected={selectedVoice?.id === voice.id}
                onSelect={() => onVoiceSelect(voice)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface VoiceOptionProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: () => void;
}

const VoiceOption: React.FC<VoiceOptionProps> = ({ voice, isSelected, onSelect }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <button
      onClick={onSelect}
      className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center justify-between group"
    >
      <div className="flex-1">
        <div className="font-medium text-gray-900">{voice.name}</div>
        <div className="text-sm text-gray-500">{voice.description}</div>
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
  );
}; 