import OpenAI from "openai";
import {
    ChatCompletion,
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionMessageParam,
} from "openai/resources/index";

let openaiClient: OpenAI;
export const getOpenAIClient = (): OpenAI => {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.GEMINI_API_KEY,
            baseURL: "https://generativelanguage.googleapis.com/v1beta/",
        });
    }
    return openaiClient;
};

export const newGCPCompletion = async (
    messages: ChatCompletionMessageParam[],
    model: string,
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await createChatCompletion({ model: model, max_completion_tokens: 3072, messages }, mode);

// Gemini 3 models (latest - December 2025)
export const newGemini3ProCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await createChatCompletion({ model: "gemini-3-pro", max_completion_tokens: 8192, messages }, mode);

export const newGemini3FlashCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await createChatCompletion({ model: "gemini-3-flash", max_completion_tokens: 8192, messages }, mode);

// Gemini 2.x models (legacy)
export const newGemini25ProCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await createChatCompletion({ model: "gemini-2.5-pro", max_completion_tokens: 8192, messages }, mode);

export const newGemini25FlashCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await createChatCompletion({ model: "gemini-2.5-flash", max_completion_tokens: 8192, messages }, mode);

export const createChatCompletion = async (params: ChatCompletionCreateParamsNonStreaming, mode = 'json'): Promise<ChatCompletion.Choice[]> => {
    const settings = { ...params };
    if (mode === 'json') {
        settings.response_format = { type: 'json_object' };
    }
    const reply = await getOpenAIClient().chat.completions.create(settings);
    return reply?.choices;
};