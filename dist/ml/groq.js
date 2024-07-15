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
export const newGroqCompletion = async (messages, model) => {
    const reply = await getGroqClient().chat.completions.create({
        ...defaultOpenAISettings,
        messages: messages,
        model: model,
    });
    return reply?.choices;
};
