import express from 'express';
import { getAllStories, getStoryById, generateDraft } from '../controllers/storyController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getAllStories);
router.get('/:id', getStoryById);
router.post('/generate', generateDraft);

export default router; 