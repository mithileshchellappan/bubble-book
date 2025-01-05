import { generateDalleImage } from '../services/imageService.js';
import { Story } from '../models/Story.js';
export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageUrl = await generateDalleImage(prompt);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const regenerateImage = async (req, res) => {
  try {
    const { prompt, panelId, storyId } = req.body;
    const newImageUrl = await generateDalleImage(prompt);
    const story = await Story.findOne({ id: storyId });
    const panel = story.pages.find(page => page.panels.some(panel => panel.id === panelId));
    panel.imageUrl = newImageUrl;
    await story.save();
    res.json({ imageUrl: newImageUrl });
  } catch (error) {
    console.error('Image regeneration error:', error);
    res.status(500).json({ error: error.message });
  }
};
