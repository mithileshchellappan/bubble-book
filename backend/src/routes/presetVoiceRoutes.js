import express from 'express';
import { synthesizeSpeech, getAvailableVoices } from '../services/presetVoiceService.js';

const router = express.Router();

// Get all available Azure voices
router.get('/voices', async (req, res) => {
  try {
    const voices = await getAvailableVoices();
    res.json(voices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Synthesize speech with voice
router.post('/synthesize', async (req, res) => {
  try {
    const { text, voiceId, style } = req.body;
    const audioData = await synthesizeSpeech(text, voiceId, style);
    
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Disposition': 'attachment; filename=speech.wav'
    });
    res.send(Buffer.from(audioData));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 