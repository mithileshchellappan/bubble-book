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
          description: "The title of the story",
        },
        pages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "The text content of the page",
              },
              panels: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    imagePrompt: {
                      type: "string",
                      description: "Detailed prompt for image generation. All prompts must use the same AI-determined style and theme for consistency.",
                    },
                  },
                  required: ["imagePrompt"],
                },
                minItems: 4,
                maxItems: 4,
                description: "Four image prompts for the page, all in the same consistent style",
              },
            },
            required: ["text", "panels"],
          },
        },
      },
      required: ["title", "pages"],
    },
  },
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
            Your task is to write a story and determine a consistent artistic style based on the story's theme, genre, and prompt.
            This style (e.g., "cartoon", "storybook watercolor", "realistic 3D") should match the tone of the story and be applied uniformly to all image prompts.
            Each page must have exactly 4 image prompts that capture different aspects of that page's text.
            Make the image prompts detailed, consistent in style, and suitable for AI image generation.`,
        },
        {
          role: "user",
          content: `Create a ${pageCount}-page children's story.
            Genre: ${genre}
            Theme: ${theme}
            Additional context: ${prompt}
            
            Determine the best artistic style based on this information and ensure all image prompts follow that style consistently.`,
        },
      ],
      functions: [storyFunctions.generateStory],
      function_call: { name: "generateStory" },
    });

    let result;
    try {
      result = JSON.parse(completion.choices[0].message.function_call.arguments);
    } catch (parseError) {
      throw new Error('Failed to parse OpenAI response: ' + parseError.message);
    }

    if (result.pages.length !== pageCount) {
      throw new Error('Generated story has an incorrect number of pages');
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