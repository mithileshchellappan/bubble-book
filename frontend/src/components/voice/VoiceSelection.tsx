import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Volume2, Heart, Check, Search, Loader2, Star } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteUpdate, setFavoriteUpdate] = useState(0);
  const voicesPerPage = 4;

  const { 
    voices, 
    selectedVoice, 
    selectedStyle,
    isLoading,
    loadVoices, 
    setSelectedVoice, 
    setSelectedStyle 
  } = usePresetVoiceStore();

  // Load voices when the component mounts
  useEffect(() => {
    loadVoices();
  }, [loadVoices]);

  const filteredVoices = useMemo(() => {
    return voices
      .filter(voice => {
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
      })
      .sort((a, b) => {
        const favorites = JSON.parse(localStorage.getItem('favoriteVoices') || '[]');
        const aIsFavorite = favorites.includes(a.id);
        const bIsFavorite = favorites.includes(b.id);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        return 0;
      });
  }, [voices, searchQuery, favoriteUpdate]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredVoices.length / voicesPerPage);
  const startIndex = (currentPage - 1) * voicesPerPage;
  const paginatedVoices = filteredVoices.slice(startIndex, startIndex + voicesPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreateStory = () => {
    if (selectedVoice) {
      onConfirm(selectedVoice.id, selectedStyle);
    }
  };

  return (
    <div className="flex flex-col h-full">
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

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Voice Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {paginatedVoices.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                isSelected={selectedVoice?.id === voice.id}
                selectedStyle={selectedStyle}
                onSelect={() => setSelectedVoice(voice)}
                onStyleSelect={setSelectedStyle}
                onFavoriteChange={() => setFavoriteUpdate(prev => prev + 1)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-6 border-t bg-white">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleCreateStory}
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

interface Voice {
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
}

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  selectedStyle: string;
  onSelect: () => void;
  onStyleSelect: (style: string) => void;
  onFavoriteChange: () => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  isSelected,
  selectedStyle,
  onSelect,
  onStyleSelect,
  onFavoriteChange
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

  // Load favorite voices from local storage
  const isFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteVoices') || '[]');
    return favorites.includes(voice.id);
  };

  // Handle favorite toggle
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favoriteVoices') || '[]');
    
    if (isFavorite()) {
      const updatedFavorites = favorites.filter((id: string) => id !== voice.id);
      localStorage.setItem('favoriteVoices', JSON.stringify(updatedFavorites));
    } else {
      favorites.push(voice.id);
      localStorage.setItem('favoriteVoices', JSON.stringify(favorites));
    }
    onFavoriteChange();
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
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayAudio}
            className={`p-2 rounded-full transition-colors ${
              isPlaying ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          </button>
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-colors hover:bg-gray-100
              ${isFavorite() ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            <Star className="w-5 h-5" />
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