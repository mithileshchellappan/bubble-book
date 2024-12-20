export const sampleStory = {
  id: '1',
  title: 'The Magic Forest Adventure',
  genre: 'fantasy',
  theme: 'nature',
  currentPage: 0,
  createdAt: new Date(),
  pages: [
    {
      id: '1',
      text: "Once upon a time, there was a magical forest filled with wonder and mystery. The trees whispered ancient secrets to those who listened carefully.",
      panels: [
        {
          id: 'panel1',
          imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
          imagePrompt: 'A mystical forest with sunbeams filtering through ancient trees, creating a magical atmosphere',
          order: 0
        },
        {
          id: 'panel2',
          imageUrl: 'https://images.unsplash.com/photo-1507371341162-763b5e419408',
          imagePrompt: 'Close-up of tree bark with mystical glowing runes carved into it',
          order: 1
        },
        {
          id: 'panel3',
          imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969',
          imagePrompt: 'Ethereal fog drifting between towering trees in a mystical forest',
          order: 2
        },
        {
          id: 'panel4',
          imageUrl: 'https://images.unsplash.com/photo-1516214104703-d870798883c5',
          imagePrompt: 'Magical butterflies glowing like tiny rainbows in forest sunlight',
          order: 3
        }
      ],
      audioUrl: "https://example.com/audio1.mp3"
    },
    {
      id: '2',
      text: "Deep in the heart of the forest lived a wise old owl who watched over all the woodland creatures.",
      panels: [
        {
          id: 'panel5',
          imageUrl: 'https://images.unsplash.com/photo-1579170053380-58064b2dee67',
          imagePrompt: 'A majestic owl perched on an ancient branch, eyes glowing with wisdom',
          order: 0
        },
        {
          id: 'panel6',
          imageUrl: 'https://images.unsplash.com/photo-1501432377862-3d0432b87a14',
          imagePrompt: 'Various woodland creatures gathered around a moonlit clearing',
          order: 1
        },
        {
          id: 'panel7',
          imageUrl: 'https://images.unsplash.com/photo-1490718720478-364a07a997cd',
          imagePrompt: 'Deer and rabbits in a mystical forest glade with floating lights',
          order: 2
        },
        {
          id: 'panel8',
          imageUrl: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7',
          imagePrompt: 'Owl\'s perspective of the forest at twilight with magical elements',
          order: 3
        }
      ],
      audioUrl: "https://example.com/audio2.mp3"
    }
  ]
};