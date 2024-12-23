export interface Story {
  id: string;
  title: string;
  status: 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  pages: Array<{
    id: string;
    text: string;
    audioUrl?: string;
    audioStatus: 'PENDING' | 'GENERATED' | 'FAILED';
    panels: Array<{
      id: string;
      imagePrompt: string;
      imageUrl?: string;
      imageStatus: 'PENDING' | 'GENERATED' | 'FAILED';
      order: number;
    }>;
  }>;
  createdAt: Date;
  completedAt?: Date;
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
