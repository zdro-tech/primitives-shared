import OpenAI from 'openai';
import { retryOptions } from './shared.js';
import { backOff } from 'exponential-backoff';
let openAIClient;
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
};
export const defaultOpenAISettings = {
    temperature: 0.4,
    n: 1,
    max_tokens: 3072,
};
export const createChatCompletion = async (params, mode = 'json') => {
    const settings = { ...params };
    if (mode === 'json') {
        settings.response_format = { type: 'json_object' };
    }
    return await backOff(async () => {
        const reply = await getOpenAIClient().chat.completions.create(settings);
        return reply?.choices;
    }, retryOptions);
};
export const new4oMiniCompletition = async (messages, mode) => await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-4o-mini", messages }, mode);
export const new4oCompletition = async (messages, mode) => await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-4o", messages }, mode);
export const newO1MiniCompletition = async (messages, mode) => await createChatCompletion({ model: "o1-mini", max_completion_tokens: 3072, messages }, mode);
export const new4Completition = async (messages, mode) => await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-4-turbo", messages }, mode);
export const new35Completition = async (messages, mode) => await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-3.5-turbo-0125", messages });
export const newO3MiniCompletition = async (messages, mode) => await createChatCompletion({ model: "o3-mini", reasoning_effort: "medium", messages, max_completion_tokens: 3072 }, mode);
export const newO3MiniHighCompletition = async (messages, mode) => await createChatCompletion({ model: "o3-mini", reasoning_effort: "high", messages, max_completion_tokens: 3072 }, mode);
export const newO1Completition = async (messages, mode) => await createChatCompletion({ model: "o1", messages, max_completion_tokens: 3072, temperature: 1 }, mode);
export const newGPT52Completition = async (messages, mode) => await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-5.2", messages, max_tokens: 8192 }, mode);
export const newGPT52MiniCompletition = async (messages, mode) => await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-5.2-mini", messages, max_tokens: 8192 }, mode);
export const newGPT52ProCompletition = async (messages, mode) => await createChatCompletion({ ...defaultOpenAISettings, model: "gpt-5.2-pro", messages, max_tokens: 8192 }, mode);
export const visionCompletion = async (messages) => await createChatCompletion({ model: "gpt-5.2", messages, max_tokens: 8192 });
export const createEmbeddings = async (input, model = "text-embedding-3-small") => {
    const reply = await getOpenAIClient().embeddings.create({ model, input });
    return reply?.data.map(item => item.embedding);
};
