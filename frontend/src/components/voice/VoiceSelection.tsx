import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Heart, Check, Search } from 'lucide-react';
import { usePresetVoiceStore } from '../../stores/usePresetVoiceStore';

interface VoiceSelectionProps {
  onConfirm: (voiceId: string, style: string) => void;
  onBack: () => void;
}

export const VoiceSelection: React.FC<VoiceSelectionProps> = ({
  onConfirm,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    voices, 
    selectedVoice, 
    selectedStyle,
    isLoading,
    loadVoices, 
    setSelectedVoice, 
    setSelectedStyle 
  } = usePresetVoiceStore();

  const filteredVoices = voices.filter(voice => {
    const searchLower = searchQuery.toLowerCase();
    return (
      voice.name.toLowerCase().includes(searchLower) ||
      (voice.description || '').toLowerCase().includes(searchLower) ||
      (voice.personality || '').toLowerCase().includes(searchLower) ||
      (voice.scenarios || '').toLowerCase().includes(searchLower) ||
      (voice.styles || []).some(style => style.toLowerCase().includes(searchLower)) ||
      (voice.voiceTags || []).some(tagGroup => 
        (tagGroup.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
      )
    );
  });

  React.useEffect(() => {
    loadVoices();
  }, [loadVoices]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose a Voice for Your Story</h2>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by voice name, style, or characteristics..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 
                     focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* Voice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredVoices.map((voice) => (
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
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Back
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
          Create Story
        </button>
      </div>
    </div>
  );
};

interface VoiceCardProps {
  voice: {
    id: string;
    name: string;
    gender: string;
    description: string;
    styles: string[];
    sampleAudioUrl: string;
    voiceTags: {
      name: string;
      tags: string[];
    }[];
    personality: string;
    scenarios: string;
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
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const allTags = (voice.voiceTags || []).reduce((acc, group) => [...acc, ...group.tags], [] as string[]);
  const displayTags = showAllTags ? allTags : allTags.slice(0, 3);

  const styles = voice.styles || [];
  const displayStyles = showAllStyles ? styles : styles.slice(0, 3);

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

  // Format strings to add spaces after commas
  const formattedPersonality = voice.personality?.replace(/,/g, ', ');
  const formattedScenarios = voice.scenarios?.replace(/,/g, ', ');

  return (
    <div 
      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer
        ${isSelected 
          ? 'border-purple-600 bg-purple-50/50' 
          : 'border-gray-200 hover:border-purple-300 bg-white'}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{voice.name}</h3>
          <p className="text-sm text-gray-500">{voice.gender}</p>
          
          <div className="flex gap-2 mt-2">
            {formattedPersonality && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {formattedPersonality}
              </span>
            )}
            {formattedScenarios && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {formattedScenarios}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{voice.description}</p>
          <div className="flex flex-wrap items-center gap-1 mt-2">
            {displayTags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {allTags.length > 3 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllTags(!showAllTags);
                }}
                className="px-2 py-0.5 text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                {showAllTags ? 'Show Less' : `+${allTags.length - 3} More`}
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handlePlayAudio}
            className={`p-2 rounded-full transition-colors ${
              isPlaying ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      {voice.styles.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-500 mb-2">
            {voice.styles.length} styles
          </div>
          <div className="flex flex-wrap gap-2">
            {displayStyles.map((style) => (
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
            {styles.length > 3 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllStyles(!showAllStyles);
                }}
                className="px-2 py-0.5 text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                {showAllStyles ? 'Show Less' : `+${styles.length - 3} More`}
              </button>
            )}
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