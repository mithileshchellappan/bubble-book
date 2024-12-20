import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}
export const openai = new AzureOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  deployment: 'gpt-4o',
  apiVersion: '2024-08-01-preview'
}); 

export const dalle = new AzureOpenAI({
  apiKey: process.env.DALLE_API_KEY,
  baseURL: process.env.DALLE_BASE_URL,
  deployment: 'dall-e-3',
  apiVersion: '2024-02-01'
}); 