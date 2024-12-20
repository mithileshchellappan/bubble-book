import { create } from 'zustand';
import { Voice } from '../types/voice';

interface VoiceStore {
  customVoices: Voice[];
  addVoice: (voice: Voice) => void;
  removeVoice: (id: string) => void;
}

const initialCustomVoices: Voice[] = [
  { 
    id: 'custom-1', 
    name: 'My Storyteller Voice', 
    description: 'Personal narration style for bedtime stories',
    isCustom: true 
  },
  { 
    id: 'custom-2', 
    name: 'Adventure Voice', 
    description: 'Energetic voice for exciting tales',
    isCustom: true 
  }
];

export const useVoiceStore = create<VoiceStore>((set) => ({
  customVoices: initialCustomVoices,
  addVoice: (voice) => set((state) => ({ 
    customVoices: [...state.customVoices, voice] 
  })),
  removeVoice: (id) => set((state) => ({ 
    customVoices: state.customVoices.filter(v => v.id !== id) 
  })),
})); 