import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Save, Play } from 'lucide-react';

interface CreateVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  onSave: (voice: { id: string; name: string; description: string }) => void;
}

export const CreateVoiceModal: React.FC<CreateVoiceModalProps> = ({
  isOpen,
  onClose,
  isRecording,
  setIsRecording,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recordedSamples, setRecordedSamples] = useState<string[]>([]);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Implement recording logic
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordedSamples(prev => [...prev, 'Sample recording ' + (prev.length + 1)]);
    // Implement stop recording logic
  };

  const handleSave = () => {
    if (name && description && recordedSamples.length > 0) {
      onSave({
        id: Date.now().toString(),
        name,
        description,
      });
      setName('');
      setDescription('');
      setRecordedSamples([]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Custom Voice</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter voice name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe your voice"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Samples
                </label>
                <div className="space-y-2">
                  {recordedSamples.map((sample, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                    >
                      <span className="text-sm text-gray-600">{sample}</span>
                      <button className="p-1 hover:bg-gray-200 rounded-full">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`mt-2 w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2
                    ${isRecording
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                    } transition-colors`}
                >
                  <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? 'Stop Recording' : 'Record Sample'}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={!name || !description || recordedSamples.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg
                         hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Voice
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 