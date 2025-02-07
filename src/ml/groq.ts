import Groq from "groq-sdk";
import { ChatCompletion, ChatCompletionMessageParam, } from "openai/resources/index"
import { defaultOpenAISettings } from "./openai.js";

let groqClient: Groq;

export const getGroqClient = () => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set');
    }
    if (!groqClient) {
        groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return groqClient;
}

export const newGroqCompletion = async (messages: Array<ChatCompletionMessageParam>, model: string, mode?: string): Promise<ChatCompletion.Choice[]> => {
    const reply = await getGroqClient().chat.completions.create({
        ...defaultOpenAISettings as any,
        messages: messages as any,
        model: model
    });
    return reply?.choices as any;
}
