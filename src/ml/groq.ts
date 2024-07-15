import Groq from "groq-sdk";
import { ChatCompletionMessageParam as GroqChatCompletionMessageParam } from "groq-sdk/src/resources/chat/index.js";
import { ChatCompletionMessageParam as OpenAIChatCompletionMessageParam, ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessage, } from "openai/resources/index"
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

export const newGroqCompletion = async (messages: Array<OpenAIChatCompletionMessageParam>, model: string) => {
    const reply = await getGroqClient().chat.completions.create({
        ...defaultOpenAISettings,
        messages: messages as GroqChatCompletionMessageParam[],
        model: model,
    });
    return reply?.choices;
}
