import { openai } from './openai.js';

export const generateImage = async (prompt) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    
    return response.data[0].url;
  } catch (error) {
    console.error('Image generation error:', error);
    return 'https://placehold.co/1024x1024/purple/white?text=Image+Generation+Failed';
  }
}; 