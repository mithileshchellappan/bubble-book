import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'GENERATING', 'COMPLETED', 'FAILED'],
    default: 'DRAFT'
  },
  pages: [{
    text: String,
    audioUrl: String,
    audioStatus: {
      type: String,
      enum: ['PENDING', 'GENERATED', 'FAILED'],
      default: 'PENDING'
    },
    panels: [{
      imagePrompt: String,
      imageUrl: String,
      imageStatus: {
        type: String,
        enum: ['PENDING', 'GENERATED', 'FAILED'],
        default: 'PENDING'
      },
      order: Number
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

export const Story = mongoose.model('Story', storySchema);
