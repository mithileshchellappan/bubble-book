import { openai } from '../services/openai.js';

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    res.json({ imageUrl: image.data[0].url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
