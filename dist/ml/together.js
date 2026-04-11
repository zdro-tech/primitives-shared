import OpenAI from "openai";
import { getTimeoutMs, retryOptions } from "./shared.js";
import { backOff } from "exponential-backoff";
const TOGETHER_BASE_URL = "https://api.together.xyz/v1";
let togetherClient;
export const getTogetherClient = () => {
    if (!process.env.TOGETHER_API_KEY) {
        throw new Error("TOGETHER_API_KEY is not set");
    }
    if (!togetherClient) {
        togetherClient = new OpenAI({
            apiKey: process.env.TOGETHER_API_KEY,
            baseURL: TOGETHER_BASE_URL,
            timeout: getTimeoutMs(process.env.TOGETHER_TIMEOUT_SECONDS, process.env.OPEN_AI_TIMEOUT_SECONDS),
        });
    }
    return togetherClient;
};
export const defaultTogetherSettings = {
    n: 1,
    max_completion_tokens: 8192,
};
export const createTogetherChatCompletion = async (params, mode = "json") => {
    const settings = { ...params };
    // Together's OpenAI-compatible JSON mode is inconsistent across hosted OSS models.
    // Keep JSON validation in our parser and prompts instead of forcing response_format.
    return await backOff(async () => {
        const reply = await getTogetherClient().chat.completions.create(settings);
        return reply?.choices;
    }, retryOptions);
};
export const newTogetherCompletion = async (messages, model, mode, modelSettings = {}) => await createTogetherChatCompletion({ ...defaultTogetherSettings, ...modelSettings, model, messages }, mode);
export const newTogetherKimiK25Completion = async (messages, mode) => await newTogetherCompletion(messages, "moonshotai/Kimi-K2.5", mode, {
    temperature: 1.0,
    top_p: 0.95,
});
export const newTogetherGlm51Completion = async (messages, mode) => await newTogetherCompletion(messages, "zai-org/GLM-5.1", mode);
export const newTogetherMiniMaxM25Completion = async (messages, mode) => await newTogetherCompletion(messages, "MiniMaxAI/MiniMax-M2.5", mode);
export const newTogetherGptOss120bCompletion = async (messages, mode) => await newTogetherCompletion(messages, "openai/gpt-oss-120b", mode, {
    temperature: 1.0,
    top_p: 1.0,
    reasoning_effort: "medium",
});
