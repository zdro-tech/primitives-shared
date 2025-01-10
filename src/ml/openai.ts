import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs';
import { retryOptions } from './shared.js';
import { ChatCompletionMessageParam, ChatCompletion, ChatCompletionMessage, } from "openai/resources/index"
import { backOff } from 'exponential-backoff';

let openAIClient: OpenAI;
export const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
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
  response_format: { type: 'json_object' },
  temperature: 0.3,
  n: 1,
  // top_p: 0.5,
  max_tokens: 1000,
} as ChatCompletionCreateParamsNonStreaming


export const new4oMiniCompletition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
  return await backOff(async () => {
    const reply = await getOpenAIClient().chat.completions.create({
      ...defaultOpenAISettings,
      model: "gpt-4o-mini",
      messages: messages
    })
    return reply?.choices
  }, retryOptions)
}


export const new4oCompletition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
  return await backOff(async () => {
    const reply = await getOpenAIClient().chat.completions.create({
      ...defaultOpenAISettings,
      model: "gpt-4o",
      messages: messages
    })
    return reply?.choices
  }, retryOptions)
}

export const newO1MiniCompletition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
  const settingsCopy = JSON.parse(JSON.stringify(defaultOpenAISettings))
  delete settingsCopy.max_tokens;

  return await backOff(async () => {
    const reply = await getOpenAIClient().chat.completions.create({
      ...settingsCopy,
      model: "o1-mini",
      messages: messages,
      max_completion_tokens: 1000,
      temperature: 1
    })
    return reply?.choices
  }, retryOptions)
}

export const newO1Completition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
  const settingsCopy = JSON.parse(JSON.stringify(defaultOpenAISettings))
  delete settingsCopy.max_tokens;

  return await backOff(async () => {
    const reply = await getOpenAIClient().chat.completions.create({
      ...settingsCopy,
      model: "o1",
      messages: messages,
      max_completion_tokens: 1000,
      temperature: 1
    })
    return reply?.choices
  }, retryOptions)
}

export const new4Completition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
  return await backOff(async () => {
    const reply = await getOpenAIClient().chat.completions.create({
      ...defaultOpenAISettings,
      model: "gpt-4-turbo",
      messages: messages
    })
    return reply?.choices
  }, retryOptions)
}

export const new35Completition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
  return await backOff(async () => {
    const reply = await getOpenAIClient().chat.completions.create({
      ...defaultOpenAISettings,
      model: "gpt-3.5-turbo-0125",
      max_tokens: 1000,
      messages: messages
    })
    return reply?.choices
  }, retryOptions)
}

export const visionCompletion = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
  return await backOff(async () => {
    const reply = await getOpenAIClient().chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 1000,
      messages: messages
    });
    return reply?.choices;
  }, retryOptions);
};

export const createEmbeddings = async (input: string | string[], model = "text-embedding-3-small"): Promise<number[][]> => {
  const reply = await getOpenAIClient().embeddings.create({
    model: model,
    input: input
  })
  return reply?.data.map(item => item.embedding)
}
