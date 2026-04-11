import OpenAI from 'openai';
import { getTimeoutMs, retryOptions } from './shared.js';
import { backOff } from 'exponential-backoff';
let openAIClient;
export const getOpenAIClient = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set');
    }
    if (!openAIClient) {
        openAIClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: getTimeoutMs(process.env.OPEN_AI_TIMEOUT_SECONDS),
        });
    }
    return openAIClient;
};
export const defaultOpenAISettings = {
    temperature: 0.4,
    n: 1,
    max_completion_tokens: 8192,
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
export const newGPT54Completion = async (messages, mode) => await createChatCompletion({ model: "gpt-5.4", messages, max_completion_tokens: 8192 }, mode);
export const newGPT54MiniCompletion = async (messages, mode) => await createChatCompletion({ model: "gpt-5.4-mini", messages, max_completion_tokens: 8192 }, mode);
export const newGPT54NanoCompletion = async (messages, mode) => await createChatCompletion({ model: "gpt-5.4-nano", messages, max_completion_tokens: 8192 }, mode);
export const visionCompletion = async (messages) => await createChatCompletion({ model: "gpt-5.4", messages, max_completion_tokens: 8192 });
export const createEmbeddings = async (input, model = "text-embedding-3-small") => {
    const reply = await getOpenAIClient().embeddings.create({ model, input });
    return reply?.data.map(item => item.embedding);
};
