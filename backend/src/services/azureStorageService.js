import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient('bubble-book-voice');

export const uploadAudioToBlob = async (buffer, fileName) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: 'audio/wav' }
    });
    return blockBlobClient.url;
  } catch (error) {
    console.error('Error uploading audio to Azure Storage:', error);
    throw error;
  }
}; 