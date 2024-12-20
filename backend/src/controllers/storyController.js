import { Story } from '../models/Story.js';
import { generateStoryDraft } from '../services/textService.js';
import { generateImage } from '../services/imageService.js';

export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateDraft = async (req, res) => {
  try {
    const { prompt, genre, theme, pageCount } = req.body;
    const draft = await generateStoryDraft({ prompt, genre, theme, pageCount });
    res.json(draft);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
