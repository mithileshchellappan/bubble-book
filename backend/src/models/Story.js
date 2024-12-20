import mongoose from 'mongoose';

const panelSchema = new mongoose.Schema({
  id: String,
  imageUrl: String,
  imagePrompt: String,
  order: Number,
  imageStatus: {
    type: String,
    enum: ['PENDING', 'GENERATED', 'FAILED'],
    default: 'PENDING'
  }
});

const pageSchema = new mongoose.Schema({
  id: String,
  text: String,
  imageUrl: String,
  panels: [panelSchema],
  customPrompt: String
});

const storySchema = new mongoose.Schema({
  title: String,
  genre: {
    type: String,
    enum: ['FANTASY', 'ADVENTURE', 'EDUCATIONAL', 'BEDTIME', 'FAIRY_TALE'],
    default: 'FANTASY'
  },
  theme: {
    type: String,
    enum: ['NATURE', 'ANIMALS', 'SPACE', 'OCEAN', 'FRIENDSHIP', 'FAMILY'],
    default: 'NATURE'
  },
  pages: [pageSchema],
  currentPage: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Story = mongoose.model('Story', storySchema);
