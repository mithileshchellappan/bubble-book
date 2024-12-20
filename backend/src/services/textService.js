import dotenv from 'dotenv';
import { openai } from './openai.js';
dotenv.config();


const storyFunctions = {
  generateStory: {
    name: "generateStory",
    description: "Generate a children's story with title, pages of text, and image prompts",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the story"
        },
        pages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "The text content of the page"
              },
              panels: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    imagePrompt: {
                      type: "string",
                      description: "Detailed prompt for image generation. It should be very detailed to help the AI generate a high quality image."
                    }
                  },
                  required: ["imagePrompt"]
                },
                minItems: 4,
                maxItems: 4,
                description: "Four image prompts for the page"
              }
            },
            required: ["text", "panels"]
          }
        }
      },
      required: ["title", "pages"]
    }
  }
};

export const generateStoryDraft = async (input) => {
  const { prompt, pageCount, genre, theme } = input;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a children's story writer specializing in creating engaging, age-appropriate content. 
            Each page should have exactly 4 image prompts that capture different moments or aspects of that page's text.
            Make the image prompts detailed and specific, suitable for AI image generation.`
        },
        {
          role: "user",
          content: `Create a ${pageCount}-page children's story.
            Genre: ${genre}
            Theme: ${theme}
            Additional context: ${prompt}
            
            Each page must have 4 image prompts that visualize different aspects of the page's text.`
        }
      ],
      functions: [storyFunctions.generateStory],
      function_call: { name: "generateStory" }
    });

    let result;
    try {
      result = JSON.parse(completion.choices[0].message.function_call.arguments);
    } catch (parseError) {
      throw new Error('Failed to parse OpenAI response: ' + parseError.message);
    }
    
    if (result.pages.length !== pageCount) {
      throw new Error('Generated story has incorrect number of pages');
    }

    result.pages.forEach((page, index) => {
      if (page.panels.length !== 4) {
        throw new Error(`Page ${index + 1} does not have exactly 4 image panels`);
      }
    });

    return result;
  } catch (error) {
    console.log(error);
    if (error.response) {
      throw new Error(`OpenAI API error: ${error.response.status} - ${error.response.data.error.message}`);
    }
    throw error;
  }
}; 