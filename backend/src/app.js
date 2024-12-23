import express from 'express';
import cors from 'cors';
import audioRoutes from './routes/audioRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';
import presetVoiceRoutes from './routes/presetVoiceRoutes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use('/api/audio', audioRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/preset-voices', presetVoiceRoutes);

export default app;