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

export const defaultGroqSettings = {
    temperature: 0.4,
    max_completion_tokens: 8192,
};

export const newGroqCompletion = async (
    messages: Array<ChatCompletionMessageParam>,
    model: string,
    mode?: string,
    modelSettings: Record<string, unknown> = {}
): Promise<ChatCompletion.Choice[]> => {
    const settings = { ...defaultGroqSettings as any, ...modelSettings, messages: messages as any, model: model };
    if (mode === 'json') {
        settings.response_format = { type: 'json_object' };
    }
    const reply = await getGroqClient().chat.completions.create(settings);
    return reply?.choices as any;
}

export const newGroqGptOss120bCompletion = async (messages: Array<ChatCompletionMessageParam>, mode?: string): Promise<ChatCompletion.Choice[]> => {
    return await newGroqCompletion(messages, "openai/gpt-oss-120b", mode, {
        temperature: 0.6,
        top_p: 0.95,
        reasoning_effort: "medium",
        include_reasoning: false,
    });
}
