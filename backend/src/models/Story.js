import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
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
  voice: {
    id: String,
    style: String
  },
  pages: [{
    id: String,
    text: String,
    audioUrl: String,
    audioStatus: {
      type: String,
      enum: ['PENDING', 'GENERATED', 'FAILED'],
      default: 'PENDING'
    },
    panels: [{
      id: String,
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

storySchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Story = mongoose.model('Story', storySchema);
