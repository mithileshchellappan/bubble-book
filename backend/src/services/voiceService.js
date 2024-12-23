import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';
import dotenv from 'dotenv';
import { VoiceProfile } from '../models/VoiceProfile.js';
dotenv.config();

const accountName = "stmithilesh1648307093335";
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = "bubble-book-voice";

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);
const containerClient = blobServiceClient.getContainerClient(containerName);

const generateSasUrl = (blobName) => {
  const blobClient = containerClient.getBlobClient(blobName);
  const startsOn = new Date();
  const expiresOn = new Date(startsOn);
  expiresOn.setMinutes(startsOn.getMinutes() + 60);

  const sasOptions = {
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("r"),
    startsOn,
    expiresOn,
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();

  return `${blobClient.url}?${sasToken}`;
};

export const createVoiceProfile = async (consentAudio, sampleAudio, name, description, fullName, userId) => {
  try {
    console.log('Creating voice profile...');

    // 1. Upload audio files to blob storage
    const consentBlobName = `${fullName.replace(/\s+/g, '-')}-consent-${Date.now()}.mp3`;
    const sampleBlobName = `${fullName.replace(/\s+/g, '-')}-sample-${Date.now()}.mp3`;
    
    const consentBlockBlob = containerClient.getBlockBlobClient(consentBlobName);
    const sampleBlockBlob = containerClient.getBlockBlobClient(sampleBlobName);
    
    // Set content type to audio/mpeg for MP3
    const options = { blobHTTPHeaders: { blobContentType: 'audio/mpeg' } };
    
    await consentBlockBlob.uploadData(consentAudio, options);
    await sampleBlockBlob.uploadData(sampleAudio, options);

    // 2. Get SAS URLs
    const consentUrl = generateSasUrl(consentBlobName);
    const sampleUrl = generateSasUrl(sampleBlobName);

    // 3. Upload consent
    const consentData = {
      audioData: consentAudio,
      locale: 'en-US',
      displayName: name,
      voiceTalentName: fullName,
      companyName: 'notagodzilla',
      project: 'https://ai-mithilesh153-1998.cognitiveservices.azure.com/customvoice/trial/projects/c8bb5252-77c2-42c2-91f6-e66a9085d0d3?api-version=2023-07-01-preview'
    };

    console.log('Consent data:', consentData);

    const consentResponse = await fetch(
      `${process.env.AZURE_SPEECH_ENDPOINT}/customvoice/trial/consents?api-version=2023-07-01-preview`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(consentData)
      }
    );

    console.log('Consent response:', consentResponse);
    if (!consentResponse.ok) {
      const errorText = await consentResponse.text();
      console.error('Consent error:', errorText);
      throw new Error(`Failed to upload consent: ${errorText}`);
    }

    const consent = await consentResponse.json();
    console.log('Consent uploaded:', consent);

    // 4. Create voice profile
    const voiceData = {
      audioUrl: sampleUrl,
      displayName: name,
      locale: 'en-US'
    };

    console.log('Voice data:', voiceData);

    const voiceResponse = await fetch(
      `${process.env.AZURE_SPEECH_ENDPOINT}/customvoice/trial/models?api-version=2023-07-01-preview`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(voiceData)
      }
    );

    if (!voiceResponse.ok) {
      const errorText = await voiceResponse.text();
      console.error('Voice error:', errorText);
      throw new Error(`Failed to create voice: ${errorText}`);
    }

    const voice = await voiceResponse.json();
    console.log('Voice created:', voice);

    // Save to MongoDB
    const voiceProfile = new VoiceProfile({
      userId,
      projectId: voice.id,
      name,
      description,
      fullName,
      status: 'training'
    });

    await voiceProfile.save();
    return voiceProfile;
  } catch (error) {
    console.error('Error creating voice profile:', error);
    throw error;
  }
};

export const checkVoiceProfileStatus = async (projectId) => {
  try {
    const response = await fetch(
      `${process.env.AZURE_SPEECH_ENDPOINT}/customvoice/trial/models/${projectId}?api-version=2024-02-01-preview`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY
        }
      }
    );
    console.log('Response:', response);
    if (!response.ok) {
      throw new Error(`Failed to get voice status: ${await response.text()}`);
    }

    const voice = await response.json();
    console.log('Voice status:', voice);

    const status = voice.status === 'Succeeded' ? 'ready' :
                   voice.status === 'Failed' ? 'failed' : 'training';

    await VoiceProfile.findOneAndUpdate(
      { voiceId },
      { status },
      { new: true }
    );

    return status;
  } catch (error) {
    console.error('Error checking voice status:', error);
    throw error;
  }
};

export const getUserVoiceProfiles = async (userId) => {
  try {
    return await VoiceProfile.find({ userId }).lean();
  } catch (error) {
    console.error('Error getting user voice profiles:', error);
    throw error;
  }
}; 