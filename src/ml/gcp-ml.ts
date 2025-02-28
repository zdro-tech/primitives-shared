import OpenAI from "openai";
import {
    ChatCompletion,
    ChatCompletionMessageParam,
} from "openai/resources/index";
import { createChatCompletion } from "./index.js";

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