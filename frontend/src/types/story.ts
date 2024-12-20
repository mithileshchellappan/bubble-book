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
  panels: StoryPanel[];
}

export interface StoryPanel {
  id: string;
  imageUrl: string;
  imagePrompt: string;
  order: number;
}

export interface StoryDraft {
  id: string;
  title: string;
  pages: {
    id: string;
    text: string;
    imagePrompt: string;
    panels: {
      id: string;
      imagePrompt: string;
      order: number;
    }[];
  }[];
  genre: string;
  theme: string;
}
export type Genre = 'fantasy' | 'adventure' | 'educational' | 'bedtime' | 'fairy-tale';
export type Theme = 'nature' | 'animals' | 'space' | 'ocean' | 'friendship' | 'family';
