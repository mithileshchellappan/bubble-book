import { Story } from '../models/Story.js';
import { generateStoryDraft } from '../services/textService.js';
import { generateDalleImage } from '../services/imageService.js';
import { synthesizeSpeech } from '../services/presetVoiceService.js';
import { uploadAudioToBlob } from '../services/azureStorageService.js';

export const getAllStories = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const stories = await Story.find({ userId }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStoryById = async (req, res) => {
  try {
    const story = await Story.findOne({ id: req.params.id });
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    console.error('Failed to get story:', error);
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

export const generateStory = async (req, res) => {
  try {
    const { draft, voiceId, voiceStyle } = req.body;
    const userId = req.auth.userId;
    const storyId = Math.random().toString(36).substr(2, 9);
    
    console.log('Starting story generation:', {
      storyId,
      title: draft.title,
      pageCount: draft.pages.length,
      voiceId,
      voiceStyle
    });

    // Initialize story in DB with userId
    const story = await Story.create({
      id: storyId,
      userId,
      title: draft.title,
      status: 'GENERATING',
      voice: {
        id: voiceId,
        style: voiceStyle
      },
      pages: draft.pages.map((page, pageIndex) => ({
        id: `page-${storyId}-${pageIndex}`,
        text: page.text,
        audioStatus: 'PENDING',
        panels: page.panels.map((panel, panelIndex) => ({ 
          id: `panel-${storyId}-${pageIndex}-${panelIndex}`,
          imagePrompt: panel.imagePrompt,
          imageStatus: 'PENDING',
          order: panelIndex
        }))
      }))
    });
    console.log("Story created in DB:", story);
    // Start async generation process
    generateStoryAssets(story).catch(error => {
      console.error('Story generation failed:', error);
      Story.updateOne(
        { id: storyId },
        { $set: { status: 'FAILED' } }
      ).exec();
    });

    // Return immediately with storyId
    res.json({ storyId });

  } catch (error) {
    console.error('Failed to initialize story:', error);
    res.status(500).json({ error: error.message });
  }
};

// Separate async function for generation
async function generateStoryAssets(story) {
  try {
    // Generate images in batches of 3
    for (let pageIndex = 0; pageIndex < story.pages.length; pageIndex++) {
      const page = story.pages[pageIndex];
      const panels = page.panels;
      
      for (let i = 0; i < panels.length; i += 3) {
        const batch = panels.slice(i, i + 3);
        const batchPromises = batch.map(async (panel, batchIndex) => {
          try {
            const imageUrl = await generateDalleImage(panel.imagePrompt);
            await Story.updateOne(
              { id: story.id, 'pages.panels.imagePrompt': panel.imagePrompt },
              { 
                $set: { 
                  'pages.$[page].panels.$[panel].imageUrl': imageUrl,
                  'pages.$[page].panels.$[panel].imageStatus': 'GENERATED'
                }
              },
              {
                arrayFilters: [
                  { 'page.text': page.text },
                  { 'panel.imagePrompt': panel.imagePrompt }
                ]
              }
            );
          } catch (error) {
            console.error('Image generation error:', error);
            await Story.updateOne(
              { id: story.id, 'pages.panels.imagePrompt': panel.imagePrompt },
              { $set: { 'pages.$[page].panels.$[panel].imageStatus': 'FAILED' } },
              { arrayFilters: [{ 'page.text': page.text }, { 'panel.imagePrompt': panel.imagePrompt }] }
            );
          }
        });

        await Promise.all(batchPromises);
        if (i + 3 < panels.length) {
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
      }

      // Generate audio for the page
      try {
        const audioBuffer = await synthesizeSpeech(page.text, story.voice.id, story.voice.style);
        const fileName = `${story.id}/page-${pageIndex + 1}.wav`;
        const audioUrl = await uploadAudioToBlob(audioBuffer, fileName);
        
        await Story.updateOne(
          { id: story.id, 'pages.text': page.text },
          { 
            $set: { 
              'pages.$.audioUrl': audioUrl,
              'pages.$.audioStatus': 'GENERATED'
            }
          }
        );
      } catch (error) {
        console.error('Audio generation error:', error);
        await Story.updateOne(
          { id: story.id, 'pages.text': page.text },
          { $set: { 'pages.$.audioStatus': 'FAILED' } }
        );
      }
    }

    // Update story status to completed
    await Story.updateOne(
      { id: story.id },
      { 
        $set: { 
          status: 'COMPLETED',
          completedAt: new Date()
        }
      }
    );

  } catch (error) {
    console.error('Story generation failed:', error);
    await Story.updateOne(
      { id: story.id },
      { $set: { status: 'FAILED' } }
    );
    throw error;
  }
}