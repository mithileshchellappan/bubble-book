import { dalle, dalle2 } from './openai.js';
import { uploadImageToBlob } from './azureStorageService.js';

export const generateDalleImage = async (prompt, useDalle2 = false) => {
  try {
    console.log("Generating image with prompt:", prompt);
    const response = await (useDalle2 ? dalle2 : dalle).images.generate({
      model: "dall-e-3",
      prompt: `Generate a widescreen image for the following prompt: ${prompt}`,
      n: 1,
      size: "1792x1024"
    });

    const imageUrl = response.data[0].url;
    console.log("Generated image:", imageUrl);

    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const blobUrl = await uploadImageToBlob(buffer, `images/${Date.now()}.png`);

    return blobUrl;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}; 
