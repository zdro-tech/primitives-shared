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
    response_format: { type: 'json_object' },
    temperature: 0.3,
    n: 1,
    // top_p: 0.5,
    max_tokens: 1000,
};
export const new4oMiniCompletition = async (messages) => {
    return await backOff(async () => {
        const reply = await getOpenAIClient().chat.completions.create({
            ...defaultOpenAISettings,
            model: "gpt-4o-mini",
            messages: messages
        });
        return reply?.choices;
    }, retryOptions);
};
export const new4oCompletition = async (messages) => {
    return await backOff(async () => {
        const reply = await getOpenAIClient().chat.completions.create({
            ...defaultOpenAISettings,
            model: "gpt-4o",
            messages: messages
        });
        return reply?.choices;
    }, retryOptions);
};
export const newO1MiniCompletition = async (messages) => {
    const settingsCopy = JSON.parse(JSON.stringify(defaultOpenAISettings));
    delete settingsCopy.max_tokens;
    return await backOff(async () => {
        const reply = await getOpenAIClient().chat.completions.create({
            ...settingsCopy,
            model: "o1-mini",
            messages: messages,
            max_completion_tokens: 1000,
            temperature: 1
        });
        return reply?.choices;
    }, retryOptions);
};
export const newO1Completition = async (messages) => {
    const settingsCopy = JSON.parse(JSON.stringify(defaultOpenAISettings));
    delete settingsCopy.max_tokens;
    return await backOff(async () => {
        const reply = await getOpenAIClient().chat.completions.create({
            ...settingsCopy,
            model: "o1",
            messages: messages,
            max_completion_tokens: 1000,
            temperature: 1
        });
        return reply?.choices;
    }, retryOptions);
};
export const new4Completition = async (messages) => {
    return await backOff(async () => {
        const reply = await getOpenAIClient().chat.completions.create({
            ...defaultOpenAISettings,
            model: "gpt-4-turbo",
            messages: messages
        });
        return reply?.choices;
    }, retryOptions);
};
export const new35Completition = async (messages) => {
    return await backOff(async () => {
        const reply = await getOpenAIClient().chat.completions.create({
            ...defaultOpenAISettings,
            model: "gpt-3.5-turbo-0125",
            max_tokens: 1000,
            messages: messages
        });
        return reply?.choices;
    }, retryOptions);
};
export const visionCompletion = async (messages) => {
    return await backOff(async () => {
        const reply = await getOpenAIClient().chat.completions.create({
            model: "gpt-4-vision-preview",
            max_tokens: 1000,
            messages: messages
        });
        return reply?.choices;
    }, retryOptions);
};
export const createEmbeddings = async (input, model = "text-embedding-3-small") => {
    const reply = await getOpenAIClient().embeddings.create({
        model: model,
        input: input
    });
    return reply?.data.map(item => item.embedding);
};
