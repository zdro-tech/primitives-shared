import OpenAI from "openai";
import { createChatCompletion } from "./index.js";
let openaiClient;
export const getOpenAIClient = () => {
    if (!process.env.GEMINI_API_KEY)
        throw new Error("GEMINI_API_KEY is not set");
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.GEMINI_API_KEY,
            baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        });
    }
    return openaiClient;
};
export const newGCPCompletion = async (messages, model, mode) => await createChatCompletion({ model: model, max_completion_tokens: 3072, messages }, mode);
