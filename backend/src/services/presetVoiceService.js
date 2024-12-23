import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import dotenv from 'dotenv';
dotenv.config();

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_KEY,
  'westeurope'
);

export const synthesizeSpeech = async (text, voiceId, style = '') => {
  try {
    // Configure voice
    speechConfig.speechSynthesisVoiceName = voiceId;
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    // Create SSML with style if provided
    let ssml = '';
    if (style) {
      ssml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
               xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
          <voice name="${voiceId}">
            <mstts:express-as style="${style}">
              ${text}
            </mstts:express-as>
          </voice>
        </speak>`;
    }

    // Generate speech
    const result = await new Promise((resolve, reject) => {
      if (style) {
        synthesizer.speakSsmlAsync(
          ssml,
          result => {
            synthesizer.close();
            resolve(result);
          },
          error => {
            synthesizer.close();
            reject(error);
          }
        );
      } else {
        synthesizer.speakTextAsync(
          text,
          result => {
            synthesizer.close();
            resolve(result);
          },
          error => {
            synthesizer.close();
            reject(error);
          }
        );
      }
    });

    // Check result
    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
      return result.audioData;
    } else {
      throw new Error(
        `Speech synthesis failed: ${result.errorDetails}`
      );
    }
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
};

// Get available voices using SDK
export const getAvailableVoices = async () => {
  try {
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    const result = await synthesizer.getVoicesAsync();
    synthesizer.close();
    const voiceFetch = await fetch(`${process.env.AZURE_SPEECH_ENDPOINT}/texttospeech/acc/v3.0-beta1/vcg/voices`, {
        "headers": {
            "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({queryCondition: {items: [{name: "VoiceTypeList", value: "StandardVoice", operatorKind: "Contains"}]}}),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    });
    const voiceData = await voiceFetch.json();
    if (result.reason === sdk.ResultReason.VoicesListRetrieved) {
      let voices = result.voices
        .filter(voice => 
          voice.locale.startsWith('en')
        )
        .filter(voice => voiceData.find(voiceData => voiceData.shortName === voice.shortName))
        .map(voice => {
        const voiceSingle = voiceData.find(voiceData => voiceData.shortName === voice.shortName)
        return {
          id: voice.shortName,
          name: voice.localName,
          description: voiceSingle.description,
          locale: voice.locale,
          gender: voice.gender === 1 ? 'Female' : 'Male',
          styles: voice.styleList || [],
          isMultilingual: voice.localName.includes('Multilingual'),
          sampleAudioUrl: voiceSingle.samples.styleSamples[0].audioFileEndpointWithSas,
          voiceType: voice.voiceType,
          voiceTags: voiceSingle.voiceTags,
          personality: voiceSingle.properties.Personality,
          scenarios: voiceSingle.properties.TailoredScenarios,
        }
      });
        voices = voices.sort((a, b) => b.styles.length - a.styles.length);
      return voices;
    } else {
      throw new Error('Failed to retrieve voices list');
    }
  } catch (error) {
    console.error('Error getting voices:', error);
    throw error;
  }
};

getAvailableVoices()