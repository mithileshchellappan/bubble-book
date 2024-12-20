import { create } from 'zustand';
import { Story, StoryDraft } from '../types/story';

interface StoryStore {
  stories: Story[];
  currentDraft: StoryDraft | null;
  currentStory: Story | null;
  isDraftGenerating: boolean;
  isGenerating: boolean;
  
  generateDraft: (prompt: string, genre: string, theme: string, pageCount: number) => Promise<void>;
  generateFullStory: () => Promise<void>;
  clearDraft: () => void;
  updatePage: (pageId: string, customPrompt: string) => void;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  stories: [],
  currentDraft: null,
  currentStory: null,
  isDraftGenerating: false,
  isGenerating: false,

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
      const pagesWithImages = await Promise.all(currentDraft.pages.map(async (page, pageIndex) => {
        const panels = await Promise.all(page.panels.map(async (panel, panelIndex) => {
          const imageUrl = await fetch('http://localhost:4000/api/images/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await window.Clerk?.session?.getToken()}`
            },
            body: JSON.stringify({ prompt: panel.imagePrompt })
          }).then(res => res.json()).then(data => data.imageUrl);

          return {
            ...panel,
            id: `panel-${pageIndex}-${panelIndex}`,
            imageUrl,
            order: panelIndex
          };
        }));

        return {
          ...page,
          id: `page-${pageIndex}`,
          panels
        };
      }));

      const story = {
        id: Date.now().toString(),
        title: currentDraft.title,
        pages: pagesWithImages,
        currentPage: 0,
        createdAt: new Date().toISOString()
      };

      set({ currentStory: story, stories: [story, ...get().stories], currentDraft: null });
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
  }
}));