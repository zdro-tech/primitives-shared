import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs';
import { retryOptions } from './shared.js';
import { ChatCompletionMessageParam, ChatCompletion, ChatCompletionMessage } from "openai/resources/index";
import { backOff } from 'exponential-backoff';

let openAIClient: OpenAI;
export const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  if (!openAIClient) {
    openAIClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: parseInt(process.env.OPEN_AI_TIMEOUT_SECONDS ?? '30') * 1000,
    });
  }
  return openAIClient;
}

export const defaultOpenAISettings = {
  temperature: 0.4,
  n: 1,
  max_completion_tokens: 8192,
} as ChatCompletionCreateParamsNonStreaming;

export const createChatCompletion = async (params: ChatCompletionCreateParamsNonStreaming, mode = 'json'): Promise<ChatCompletion.Choice[]> => {
  const settings = { ...params };
  if (mode === 'json') {
    settings.response_format = { type: 'json_object' };
  }
  return await backOff(async () => {
    const reply = await getOpenAIClient().chat.completions.create(settings);
    return reply?.choices;
  }, retryOptions);
};

export const newO3MiniCompletition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "o3-mini", reasoning_effort: "medium", messages, max_completion_tokens: 8192 }, mode);

export const newO3MiniHighCompletition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "o3-mini", reasoning_effort: "high", messages, max_completion_tokens: 8192 }, mode);

export const newO3Completition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "o3", reasoning_effort: "medium", messages, max_completion_tokens: 8192 }, mode);

export const newO4MiniCompletition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "o4-mini", reasoning_effort: "low", messages, max_completion_tokens: 8192 }, mode);

export const newGPT52Completition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "gpt-5.2", messages, max_completion_tokens: 8192 }, mode);

export const newGPT52MiniCompletition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "gpt-5-mini", messages, max_completion_tokens: 8192 }, mode);

export const newGPT52CodexCompletion = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "gpt-5.2-codex", messages, max_completion_tokens: 8192 }, mode);

export const newGPT5NanoCompletion = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "gpt-5-nano", messages, max_completion_tokens: 8192 }, mode);

export const newGPT41Completition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "gpt-4.1", messages, max_completion_tokens: 8192 }, mode);

export const newGPT41MiniCompletition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "gpt-4.1-mini", messages, max_completion_tokens: 8192 }, mode);

export const newGPT41NanoCompletion = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "gpt-4.1-nano", messages, max_completion_tokens: 8192 }, mode);

export const visionCompletion = async (
  messages: ChatCompletionMessageParam[]
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "gpt-5.2", messages, max_completion_tokens: 8192 });

export const createEmbeddings = async (input: string | string[], model = "text-embedding-3-small"): Promise<number[][]> => {
  const reply = await getOpenAIClient().embeddings.create({ model, input });
  return reply?.data.map(item => item.embedding);
};
