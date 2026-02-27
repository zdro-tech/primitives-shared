import Groq from "groq-sdk";
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
export const defaultGroqSettings = {
    temperature: 0.4,
    max_completion_tokens: 8192,
};
export const newGroqCompletion = async (messages, model, mode) => {
    const settings = { ...defaultGroqSettings, messages: messages, model: model };
    if (mode === 'json') {
        settings.response_format = { type: 'json_object' };
    }
    const reply = await getGroqClient().chat.completions.create(settings);
    return reply?.choices;
};
export const newGroqGptOss120bCompletion = async (messages, mode) => {
    return await newGroqCompletion(messages, "openai/gpt-oss-120b", mode);
};
export const newGroqKimiK2Completion = async (messages, mode) => {
    return await newGroqCompletion(messages, "moonshotai/kimi-k2-instruct-0905", mode);
};
