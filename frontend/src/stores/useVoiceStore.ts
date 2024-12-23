import { create } from 'zustand';

interface VoiceProfile {
  projectId: string;
  name: string;
  description: string;
  status: 'training' | 'ready' | 'failed';
  previewUrl?: string;
  isCustom?: boolean;
}

interface VoiceStore {
  customVoices: VoiceProfile[];
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  createVoiceProfile: (formData: FormData) => Promise<void>;
  deleteVoiceProfile: (id: string) => Promise<void>;
  loadVoiceProfiles: () => Promise<void>;
  checkProfileStatus: (profileId: string) => Promise<void>;
}

export const useVoiceStore = create<VoiceStore>((set, get) => ({
  customVoices: [],
  isRecording: false,
  setIsRecording: (recording) => set({ isRecording: recording }),

  createVoiceProfile: async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:4000/api/voice/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await window.Clerk?.session?.getToken()}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to create voice profile');
      
      const profile = await response.json();
      set(state => ({
        customVoices: [...state.customVoices, {
          ...profile,
          isCustom: true
        }]
      }));
      return profile;
    } catch (error) {
      console.error('Error creating voice profile:', error);
      throw error;
    }
  },

  deleteVoiceProfile: async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/voice/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await window.Clerk?.session?.getToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete voice profile');
      
      set(state => ({
        customVoices: state.customVoices.filter(voice => voice.projectId !== id)
      }));
    } catch (error) {
      console.error('Error deleting voice profile:', error);
      throw error;
    }
  },

  loadVoiceProfiles: async () => {
    try {
      const response = await fetch('http://localhost:4000/api/voice/profiles', {
        headers: {
          'Authorization': `Bearer ${await window.Clerk?.session?.getToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to load voice profiles');
      
      const profiles = await response.json();
      set({ customVoices: profiles });
    } catch (error) {
      console.error('Error loading voice profiles:', error);
    }
  },

  checkProfileStatus: async (profileId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/voice/status/${profileId}`, {
        headers: {
          'Authorization': `Bearer ${await window.Clerk?.session?.getToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to check voice profile status');
      const { status } = await response.json();
      
      set(state => ({
        customVoices: state.customVoices.map(voice => 
          voice.projectId === profileId ? { ...voice, status } : voice
        )
      }));

      if (status === 'training' || status === 'pending_submission') {
        setTimeout(() => get().checkProfileStatus(profileId), 30000);
      }
    } catch (error) {
      console.error('Error checking profile status:', error);
    }
  }
})); 