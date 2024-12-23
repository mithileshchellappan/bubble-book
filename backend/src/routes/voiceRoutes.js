import express from 'express';
import multer from 'multer';
import { createVoiceProfile, checkVoiceProfileStatus, getUserVoiceProfiles } from '../services/voiceService.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer();

router.post('/create', requireAuth, 
  upload.fields([
    { name: 'consentAudio', maxCount: 1 },
    { name: 'sampleAudio', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      const { name, description, fullName } = req.body;
      const consentAudio = req.files['consentAudio'][0].buffer;
      const sampleAudio = req.files['sampleAudio'][0].buffer;
      const userId = req.auth.userId;

      const profile = await createVoiceProfile(
        consentAudio, 
        sampleAudio, 
        name, 
        description,
        fullName,
        userId
      );
      res.json(profile);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Add route to get user's voice profiles
router.get('/profiles', requireAuth, async (req, res) => {
  try {
    const profiles = await getUserVoiceProfiles(req.auth.userId);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete voice profile
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    // TODO: Implement deleting voice profile from Azure
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status/:id', requireAuth, async (req, res) => {
  try {
    const status = await checkVoiceProfileStatus(req.params.id);
    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 