import express from 'express';
import { getAllStories, getStoryById, generateDraft, generateStory } from '../controllers/storyController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getAllStories);
router.get('/:id', getStoryById);
router.post('/generate', generateStory);
router.post('/draft', generateDraft);

export default router; 