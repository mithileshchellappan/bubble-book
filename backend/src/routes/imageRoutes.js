import express from 'express';
import { generateImage, regenerateImage } from '../controllers/imageController.js';

const router = express.Router();

router.post('/generate', generateImage);
router.post('/regenerate', regenerateImage);

export default router;
