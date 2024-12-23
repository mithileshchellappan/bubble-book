import { create } from 'zustand';

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

interface PresetVoiceStore {
  voices: Voice[];
  selectedVoice: Voice | null;
  selectedStyle: string;
  isLoading: boolean;
  error: string | null;
  loadVoices: () => Promise<void>;
  setSelectedVoice: (voice: Voice | null) => void;
  setSelectedStyle: (style: string) => void;
  synthesizeSpeech: (text: string) => Promise<void>;
}

export const usePresetVoiceStore = create<PresetVoiceStore>((set, get) => ({
  voices: [],
  selectedVoice: null,
  selectedStyle: '',
  isLoading: false,
  error: null,

  loadVoices: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('http://localhost:4000/api/preset-voices/voices');
      if (!response.ok) throw new Error('Failed to load voices');
      const voices = await response.json();
      set({ voices, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),

  synthesizeSpeech: async (text: string) => {
    const { selectedVoice, selectedStyle } = get();
    if (!selectedVoice) return;

    try {
      set({ isLoading: true, error: null });
      const response = await fetch('http://localhost:4000/api/preset-voices/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: selectedVoice.id,
          style: selectedStyle
        })
      });

      if (!response.ok) throw new Error('Failed to synthesize speech');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();

      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
})); 