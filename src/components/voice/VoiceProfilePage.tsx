import React, { useState, useRef, useEffect } from 'react';
import { Play, Plus, Mic, Trash2, Save, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateVoiceModal } from './CreateVoiceModal';
import { useVoiceStore } from '../../stores/useVoiceStore';

interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  previewUrl?: string;
  isCustom?: boolean;
  status: 'pending_submission' | 'training' | 'ready' | 'failed';
}

const presetVoices: VoiceProfile[] = [
  { id: '1', name: 'Story Teller', description: 'Warm and engaging narrative voice', status: 'ready' },
  { id: '2', name: 'Adventure Guide', description: 'Energetic and exciting storytelling', status: 'ready' },
  { id: '3', name: 'Gentle Reader', description: 'Soft and soothing bedtime voice', status: 'ready' },
  { id: '4', name: 'Character Actor', description: 'Dynamic voice with character variations', status: 'ready' },
];

export const VoiceProfilePage: React.FC = () => {
  const { customVoices, loadVoiceProfiles, deleteVoiceProfile, checkProfileStatus } = useVoiceStore();
  const [isRecording, setIsRecording] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);// CNV Lite requires minimum 20 samples

  useEffect(() => {
    loadVoiceProfiles().then(() => {
      // Start checking status for all pending/training profiles
      customVoices.forEach(voice => {
        if (voice.status === 'pending_submission' || voice.status === 'training') {
          checkProfileStatus(voice.projectId);
        }
      });
    });
  }, [loadVoiceProfiles]);

  const handlePlayVoice = (voiceId: string) => {
    console.log('Playing voice:', voiceId);
  };

  const handleDeleteVoice = async (voiceId: string) => {
    try {
      await deleteVoiceProfile(voiceId);
    } catch (error) {
      console.error('Error deleting voice:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-purple-900 mb-2">Voice Profiles</h1>
        <p className="text-gray-600">Create your custom voice for storytelling</p>
        <div className="mt-2 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Note: For optimal voice quality, please record clear audio samples in a quiet environment. 
            Each recording should be a complete sentence with clear pronunciation.
          </p>
        </div>
      </div>

      {/* Custom Voices */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Custom Voices</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg
                     hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Voice
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customVoices.map((voice) => (
            <VoiceCard
              key={voice.previewUrl}
              voice={voice}
              onPlay={() => handlePlayVoice(voice.id)}
              onDelete={() => handleDeleteVoice(voice.id)}
              isCustom
            />
          ))}
          {customVoices.length === 0 && (
            <div className="col-span-2 bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">You haven't created any custom voices yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Preset Voices */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preset Voices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {presetVoices.map((voice) => (
            <VoiceCard
              key={voice.id}
              voice={voice}
              onPlay={() => handlePlayVoice(voice.id)}
            />
          ))}
        </div>
      </section>

      {/* Create Voice Modal */}
      <CreateVoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />
    </div>
  );
};

interface VoiceCardProps {
  voice: VoiceProfile;
  onPlay: () => void;
  onDelete?: () => void;
  isCustom?: boolean;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ voice, onPlay, onDelete, isCustom }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{voice.name}</h3>
          <p className="text-sm text-gray-600">{voice.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {voice.status === 'training' && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Training
            </span>
          )}
          {voice.status === 'ready' && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Ready
            </span>
          )}
          {voice.status === 'failed' && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              Failed
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPlay}
          className="p-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
          disabled={voice.status !== 'ready'}
        >
          <Play className="w-4 h-4" />
        </button>
        {isCustom && onDelete && (
          <button
            onClick={onDelete}
            className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}; 