import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: String,
  firstName: String,
  lastName: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  // Additional fields for our app
  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
  voiceProfiles: [{
    name: String,
    voiceId: String,
    isDefault: Boolean
  }],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    defaultVoiceId: String,
    language: {
      type: String,
      default: 'en'
    }
  }
});

export const User = mongoose.model('User', userSchema); 