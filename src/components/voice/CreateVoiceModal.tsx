import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Save, Play, Pause } from 'lucide-react';
import { useVoiceStore } from '../../stores/useVoiceStore';

interface CreateVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

const getConsentText = (fullName: string) => (
  `I, ${fullName}, acknowledge and agree that recordings of my voice will be used by Notagodzilla to create and use a synthetic version of my voice.`
);

export const CreateVoiceModal: React.FC<CreateVoiceModalProps> = ({
  isOpen,
  onClose,
  isRecording,
  setIsRecording,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [consentBlob, setConsentBlob] = useState<Blob | null>(null);
  const [sampleBlob, setSampleBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { createVoiceProfile } = useVoiceStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRecordingConsent, setIsRecordingConsent] = useState(true);
  const [fullName, setFullName] = useState('');

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        const url = URL.createObjectURL(blob);
        
        if (isRecordingConsent) {
          setConsentBlob(blob);
        } else {
          setSampleBlob(blob);
        }
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handlePlaySample = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
    }
  }, [audioUrl]);

  // Cleanup URLs when modal closes
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleSave = async () => {
    if (!consentBlob || !sampleBlob || !name || !description || !fullName) return;
    
    try {
      const formData = new FormData();
      formData.append('consentAudio', consentBlob);
      formData.append('sampleAudio', sampleBlob);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('fullName', fullName);
      formData.append('companyName', 'Notagodzilla');
      formData.append('locale', 'en-US');

      const profile = await createVoiceProfile(formData);
      useVoiceStore.getState().checkProfileStatus(profile.projectId);
      onClose();
    } catch (error) {
      console.error('Error saving voice profile:', error);
    }
  };

  const formatTime = (time: number): string => {
    if (!isFinite(time) || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name (for consent)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full legal name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Samples
                </label>

                {isRecordingConsent ? (
                  <div className="mb-4">
                    <div className="p-4 bg-yellow-50 rounded-lg mb-4">
                      <p className="text-sm text-yellow-800 mb-2">
                        Please record yourself reading this consent statement clearly:
                      </p>
                      <p className="mt-2 font-medium text-yellow-900 p-3 bg-white/50 rounded border border-yellow-200">
                        "{getConsentText(fullName)}"
                      </p>
                      <p className="text-xs text-yellow-700 mt-2">
                        Note: This consent is required by Azure AI Services for voice creation
                      </p>
                    </div>
                    <button
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2
                        ${isRecording ? 'bg-red-600' : 'bg-purple-600'} text-white`}
                    >
                      <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                      {isRecording ? 'Stop Recording' : 'Record Consent'}
                    </button>
                    {consentBlob && (
                      <button
                        onClick={() => setIsRecordingConsent(false)}
                        className="mt-2 w-full py-2 px-4 bg-green-600 text-white rounded-lg"
                      >
                        Continue to Voice Sample
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2
                        ${isRecording ? 'bg-red-600' : 'bg-purple-600'} text-white`}
                    >
                      <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                      {isRecording ? 'Stop Recording' : 'Record Sample'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={!name || !description || !consentBlob || !sampleBlob}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg
                         hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Voice
              </button>
            </div>

            {audioUrl && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Preview Recording</span>
                    <span>{formatTime(progress)}</span>
                    <button 
                      onClick={handlePlaySample}
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {!isPlaying ? (
                        <Play className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Pause className="w-4 h-4 text-purple-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <audio 
              ref={audioRef} 
              src={audioUrl || ''} 
              className="hidden"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 