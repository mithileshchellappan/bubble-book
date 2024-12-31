import { Story, StoryDraft, Genre, Theme } from '../types/story';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  generateDraft: async (
    prompt: string, 
    genre: Genre, 
    theme: Theme, 
    pageCount: number
  ): Promise<StoryDraft> => {
    await delay(1000);
    
    const pages = Array.from({ length: pageCount }, (_, i) => ({
      text: i === 0 
        ? "Once upon a time in a magical forest, there lived a curious young fox who dreamed of reaching the stars..."
        : `Page ${i + 1} of the magical story continues...`,
      panels: [
        { imagePrompt: `A magical scene from page ${i + 1}, panel 1` },
        { imagePrompt: `A magical scene from page ${i + 1}, panel 2` },
        { imagePrompt: `A magical scene from page ${i + 1}, panel 3` },
        { imagePrompt: `A magical scene from page ${i + 1}, panel 4` }
      ]
    }));

    return {
      title: `${theme} ${genre} Story`,
      pages
    };
  },

  generateFullStory: async (draft: StoryDraft): Promise<Story> => {
    await delay(1000);
    
    return {
      id: Date.now().toString(),
      title: draft.title,
      genre: 'fantasy',
      theme: 'nature',
      createdAt: new Date(),
      currentPage: 0,
      pages: draft.pages.map((page, pageIndex) => ({
        id: `page-${pageIndex}`,
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
        text: page.text,
        panels: page.panels.map((panel, panelIndex) => ({
          id: `panel-${pageIndex}-${panelIndex}`,
          imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
          imagePrompt: panel.imagePrompt,
          order: panelIndex
        }))
      }))
    };
  },

  getStories: async (): Promise<Story[]> => {
    await delay(500);
    return [
      {
        id: '1',
        title: 'The Magic Forest',
        genre: 'fantasy',
        theme: 'nature',
        createdAt: new Date(),
        currentPage: 0,
        pages: [
          {
            id: 'page-1',
            text: 'Once upon a time in a magical forest...',
            imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
            panels: [
              {
                id: 'panel-1',
                imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
                imagePrompt: 'A magical forest scene',
                order: 0
              }
            ]
          }
        ]
      }
    ];
  },

  getStoryById: async (id: string): Promise<Story | null> => {
    await delay(500);
    const stories = await mockApi.getStories();
    return stories.find(story => story.id === id) || null;
  },

  saveStory: async (story: Story): Promise<void> => {
    await delay(500);
    console.log('Story saved:', story);
  },

  deleteStory: async (id: string): Promise<void> => {
    await delay(500);
    console.log('Story deleted:', id);
  },

  regenerateImage: async (panelId: string): Promise<string> => {
    await delay(500);
    // Mock new image URL generation
    return `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}-new`;
  }
};