import mongoose from 'mongoose';

const voiceProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  projectId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  fullName: {
    type: String,
    required: true
  },
  consentUrl: String,
  sampleUrl: String,
  status: {
    type: String,
    enum: ['pending_submission', 'training', 'ready', 'failed'],
    default: 'pending_submission'
  },
  locale: {
    type: String,
    default: 'en-US'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

voiceProfileSchema.index({ userId: 1, createdAt: -1 });

export const VoiceProfile = mongoose.model('VoiceProfile', voiceProfileSchema); 