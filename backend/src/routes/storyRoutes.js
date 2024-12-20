import express from 'express';
import { getAllStories, generateDraft } from '../controllers/storyController.js';

const router = express.Router();

router.get('/', getAllStories);
router.post('/draft', generateDraft);

export default router; 