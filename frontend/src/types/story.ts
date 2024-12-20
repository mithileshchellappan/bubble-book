export interface Story {
  id: string;
  title: string;
  genre: string;
  theme: string;
  prompt?: string;
  createdAt: Date;
  pages: StoryPage[];
  currentPage: number;
}

export interface StoryPage {
  id: string;
  text: string;
  imageUrl: string;
  panels: StoryPanel[];
}

export interface StoryPanel {
  id: string;
  imageUrl: string;
  imagePrompt: string;
  order: number;
}

export interface StoryDraft {
  title: string;
  pages: {
    text: string;
    panels: {
      imagePrompt: string;
    }[];
  }[];
}
export type Genre = 'fantasy' | 'adventure' | 'educational' | 'bedtime' | 'fairy-tale';
export type Theme = 'nature' | 'animals' | 'space' | 'ocean' | 'friendship' | 'family';
