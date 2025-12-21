import Groq from "groq-sdk";
import { defaultOpenAISettings } from "./openai.js";
let groqClient;
export const getGroqClient = () => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set');
    }
    if (!groqClient) {
        groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return groqClient;
};
export const newGroqCompletion = async (messages, model, mode) => {
    const reply = await getGroqClient().chat.completions.create({
        ...defaultOpenAISettings,
        messages: messages,
        model: model
    });
    return reply?.choices;
};
export const newGroqLlama4MaverickCompletion = async (messages, mode) => {
    return await newGroqCompletion(messages, "meta-llama/llama-4-maverick-17b-128e-instruct", mode);
};
export const newGroqLlama4ScoutCompletion = async (messages, mode) => {
    return await newGroqCompletion(messages, "meta-llama/llama-4-scout-17b-16e-instruct", mode);
};
