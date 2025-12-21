import Groq from "groq-sdk";
import { ChatCompletion, ChatCompletionMessageParam, } from "openai/resources/index"

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

// Groq uses max_tokens (OpenAI-compatible)
export const defaultGroqSettings = {
    temperature: 0.4,
    max_tokens: 3072,
};

export const newGroqCompletion = async (messages: Array<ChatCompletionMessageParam>, model: string, mode?: string): Promise<ChatCompletion.Choice[]> => {
    const settings = { ...defaultGroqSettings as any, messages: messages as any, model: model };
    if (mode === 'json') {
        settings.response_format = { type: 'json_object' };
    }
    const reply = await getGroqClient().chat.completions.create(settings);
    return reply?.choices as any;
}

export const newGroqLlama4MaverickCompletion = async (messages: Array<ChatCompletionMessageParam>, mode?: string): Promise<ChatCompletion.Choice[]> => {
    return await newGroqCompletion(messages, "meta-llama/llama-4-maverick-17b-128e-instruct", mode);
}

export const newGroqLlama4ScoutCompletion = async (messages: Array<ChatCompletionMessageParam>, mode?: string): Promise<ChatCompletion.Choice[]> => {
    return await newGroqCompletion(messages, "meta-llama/llama-4-scout-17b-16e-instruct", mode);
}
