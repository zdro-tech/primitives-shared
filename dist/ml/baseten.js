import OpenAI from "openai";
import { backOff } from "exponential-backoff";
import { getTimeoutMs, retryOptions } from "./shared.js";
const BASETEN_BASE_URL = "https://inference.baseten.co/v1";
let basetenClient;
export const getBasetenClient = () => {
    if (!process.env.BASETEN_API_KEY) {
        throw new Error("BASETEN_API_KEY is not set");
    }
    if (!basetenClient) {
        basetenClient = new OpenAI({
            apiKey: process.env.BASETEN_API_KEY,
            baseURL: BASETEN_BASE_URL,
            defaultHeaders: {
                Authorization: `Api-Key ${process.env.BASETEN_API_KEY}`,
            },
            timeout: getTimeoutMs(process.env.BASETEN_TIMEOUT_SECONDS, process.env.OPEN_AI_TIMEOUT_SECONDS),
        });
    }
    return basetenClient;
};
export const defaultBasetenSettings = {
    n: 1,
    max_completion_tokens: 8192,
};
export const createBasetenChatCompletion = async (params, mode = "json") => {
    const settings = { ...params };
    if (mode === "json") {
        settings.response_format = { type: "json_object" };
    }
    return await backOff(async () => {
        const reply = await getBasetenClient().chat.completions.create(settings);
        return reply?.choices;
    }, retryOptions);
};
export const newBasetenCompletion = async (messages, model, mode, modelSettings = {}) => await createBasetenChatCompletion({ ...defaultBasetenSettings, ...modelSettings, model, messages }, mode);
export const newBasetenKimiK25Completion = async (messages, mode) => await newBasetenCompletion(messages, "moonshotai/Kimi-K2.5", mode, {
    temperature: 1.0,
    top_p: 0.95,
});
export const newBasetenGlm5Completion = async (messages, mode) => await newBasetenCompletion(messages, "zai-org/GLM-5", mode);
