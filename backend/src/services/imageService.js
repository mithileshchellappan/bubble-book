import { dalle } from './openai.js';

export const generateDalleImage = async (prompt) => {
  try {
    console.log("Generating image with prompt:", prompt);
    // return 'https://placehold.co/1024x1024/purple/white?text=Image+Generation+Failed';
    const response = await dalle.images.generate({
      model: "dall-e-3",
      prompt: `Generate a widescreen image for the following prompt: ${prompt}`,
      n: 1,
      size: "1792x1024"
    });
    console.log("Generated image:", response.data[0].url);
    return response.data[0].url;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}; 
