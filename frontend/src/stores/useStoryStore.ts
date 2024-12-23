import { create } from 'zustand';
import { Story, StoryDraft } from '../types/story';
import { usePresetVoiceStore } from './usePresetVoiceStore';

interface StoryStore {
  stories: Story[];
  currentDraft: StoryDraft | null;
  currentStory: Story | null;
  isDraftGenerating: boolean;
  isGenerating: boolean;
  currentPage: number;
  error: string | null;
  isLoading: boolean;
  
  generateDraft: (prompt: string, genre: string, theme: string, pageCount: number) => Promise<void>;
  generateFullStory: () => Promise<void>;
  clearDraft: () => void;
  updatePage: (pageId: string, customPrompt: string) => void;
  previousPage: () => void;
  nextPage: () => void;
  setCurrentStory: (story: Story) => void;
  updatePanelImage: (pageId: string, panelId: string, newImageUrl: string) => void;
  fetchStories: () => Promise<void>;
  fetchStoryById: (id: string) => Promise<void>;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  stories: [],
  currentDraft: null,
  currentStory: null,
  isDraftGenerating: false,
  isGenerating: false,
  currentPage: 0,
  error: null,
  isLoading: false,

  generateDraft: async (prompt, genre, theme, pageCount) => {
    set({ isDraftGenerating: true });
    try {
      const response = await fetch('http://localhost:4000/api/stories/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await window.Clerk?.session?.getToken()}`
        },
        body: JSON.stringify({ prompt, genre, theme, pageCount })
      });
      
      if (!response.ok) throw new Error('Failed to generate draft');
      const draft = await response.json();
      set({ currentDraft: draft });
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      set({ isDraftGenerating: false });
    }
  },

  generateFullStory: async () => {
    const { currentDraft } = get();
    if (!currentDraft) return;

    set({ isGenerating: true });
    try {
      const token = await window.Clerk?.session?.getToken();
      const response = await fetch('http://localhost:4000/api/stories/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          draft: currentDraft,
          voiceId: usePresetVoiceStore.getState().selectedVoice?.id,
          voiceStyle: usePresetVoiceStore.getState().selectedStyle
        })
      });

      const data = await response.json();
      if (!data.storyId) {
        throw new Error('Failed to generate story');
      }

      return data.storyId;
    } finally {
      set({ isGenerating: false });
    }
  },

  clearDraft: () => set({ currentDraft: null }),

  updatePage: (pageId: string, customPrompt: string) => {
    const { currentStory } = get();
    if (!currentStory) return;

    const updatedPages = currentStory.pages.map(page => 
      page.id === pageId ? { ...page, customPrompt } : page
    );

    set({ currentStory: { ...currentStory, pages: updatedPages } });
  },

  previousPage: () => {
    const { currentPage } = get();
    if (currentPage > 0) {
      set({ currentPage: currentPage - 1 });
    }
  },

  nextPage: () => {
    const { currentPage, currentStory } = get();
    if (currentStory && currentPage < currentStory.pages.length - 1) {
      set({ currentPage: currentPage + 1 });
    }
  },

  setCurrentStory: (story: Story) => set({ currentStory: story }),

  updatePanelImage: (pageId: string, panelId: string, newImageUrl: string) => {
    const { currentStory } = get();
    if (!currentStory) return;

    const updatedPages = currentStory.pages.map(page => 
      page.id === pageId ? {
        ...page,
        panels: page.panels.map(panel => 
          panel.id === panelId ? { ...panel, imageUrl: newImageUrl } : panel
        )
      } : page
    );

    set({ currentStory: { ...currentStory, pages: updatedPages } });
  },

  fetchStories: async () => {
    set({ isLoading: true });
    try {
      const token = await window.Clerk?.session?.getToken();
      const response = await fetch('http://localhost:4000/api/stories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch stories');
      const data = await response.json();
      set({ stories: data });
    } catch (error) {
      console.error('Error fetching stories:', error);
      set({ error: 'Failed to load stories' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStoryById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = await window.Clerk?.session?.getToken();
      const response = await fetch(`http://localhost:4000/api/stories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch story');
      const data = await response.json();
      set({ 
        currentStory: data,
        currentPage: 0
      });
    } catch (error) {
      console.error('Error fetching story:', error);
      set({ error: 'Failed to load story' });
    } finally {
      set({ isLoading: false });
    }
  }
}));