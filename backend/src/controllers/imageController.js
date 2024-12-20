import { generateDalleImage } from '../services/imageService.js';

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageUrl = await generateDalleImage(prompt);
    console.log(imageUrl);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message });
  }
};
