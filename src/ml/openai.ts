import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs';

const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: parseInt(process.env.OPEN_AI_TIMEOUT_SECONDS ?? '30') * 1000,
});

const defaultOpenAISettings = {
  response_format: { type: 'json_object' },
  temperature: 0.3,
  n: 1,
  // top_p: 0.5,
  max_tokens: 1000,
} as ChatCompletionCreateParamsNonStreaming

export { openAIClient, defaultOpenAISettings }
