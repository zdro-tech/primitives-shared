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
  max_tokens: 3072,
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

export const new4oMiniCompletition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-4o-mini", messages }, mode);

export const new4oCompletition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-4o", messages }, mode);

export const newO1MiniCompletition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "o1-mini", max_completion_tokens: 3072, messages }, mode);

export const new4Completition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-4-turbo", messages }, mode);

export const new35Completition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-3.5-turbo-0125", messages });

export const newO3MiniCompletition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "o3-mini", reasoning_effort: "medium", messages, max_completion_tokens: 3072 }, mode);

export const newO3MiniHighCompletition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "o3-mini", reasoning_effort: "high", messages, max_completion_tokens: 3072 }, mode);


export const newO1Completition = async (
  messages: ChatCompletionMessageParam[],
  mode?: string
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "o1", messages, max_completion_tokens: 3072, temperature: 1 }, mode);

export const visionCompletion = async (
  messages: ChatCompletionMessageParam[]
): Promise<ChatCompletion.Choice[]> =>
  await createChatCompletion({ model: "gpt-4-vision-preview", messages });

export const createEmbeddings = async (input: string | string[], model = "text-embedding-3-small"): Promise<number[][]> => {
  const reply = await getOpenAIClient().embeddings.create({ model, input });
  return reply?.data.map(item => item.embedding);
};
