import OpenAI from "openai";
import { retryOptions } from "./shared.js";
import { backOff } from "exponential-backoff";
const FIREWORKS_BASE_URL = "https://api.fireworks.ai/inference/v1";
let fireworksClient;
export const getFireworksClient = () => {
    if (!process.env.FIREWORKS_API_KEY) {
        throw new Error("FIREWORKS_API_KEY is not set");
    }
    if (!fireworksClient) {
        fireworksClient = new OpenAI({
            apiKey: process.env.FIREWORKS_API_KEY,
            baseURL: FIREWORKS_BASE_URL,
            timeout: parseInt(process.env.FIREWORKS_TIMEOUT_SECONDS ?? process.env.OPEN_AI_TIMEOUT_SECONDS ?? "30") * 1000,
        });
    }
    return fireworksClient;
};
export const defaultFireworksSettings = {
    temperature: 0.4,
    n: 1,
    max_completion_tokens: 8192,
};
export const createFireworksChatCompletion = async (params, mode = "json") => {
    const settings = { ...params };
    if (mode === "json") {
        settings.response_format = { type: "json_object" };
    }
    return await backOff(async () => {
        const reply = await getFireworksClient().chat.completions.create(settings);
        return reply?.choices;
    }, retryOptions);
};
export const newFireworksCompletion = async (messages, model, mode) => await createFireworksChatCompletion({ ...defaultFireworksSettings, model, messages }, mode);
export const newFireworksDeepseekV3p1Completion = async (messages, mode) => await newFireworksCompletion(messages, "accounts/fireworks/models/deepseek-v3p1", mode);
export const newFireworksKimiK25Completion = async (messages, mode) => await newFireworksCompletion(messages, "accounts/fireworks/models/kimi-k2p5", mode);
export const newFireworksKimiK2Completion = async (messages, mode) => await newFireworksCompletion(messages, "accounts/fireworks/models/kimi-k2-instruct-0905", mode);
export const newFireworksGlm51Completion = async (messages, mode) => await newFireworksCompletion(messages, "accounts/fireworks/models/glm-5p1", mode);
export const newFireworksGptOss120bCompletion = async (messages, mode) => await newFireworksCompletion(messages, "accounts/fireworks/models/gpt-oss-120b", mode);
export const newFireworksMiniMaxM25Completion = async (messages, mode) => await newFireworksCompletion(messages, "accounts/fireworks/models/minimax-m2p5", mode);
