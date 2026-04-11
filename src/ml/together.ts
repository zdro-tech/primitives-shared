import OpenAI from "openai";
import {
    ChatCompletion,
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionMessageParam,
} from "openai/resources/index";
import { retryOptions } from "./shared.js";
import { backOff } from "exponential-backoff";

const TOGETHER_BASE_URL = "https://api.together.xyz/v1";

let togetherClient: OpenAI;

export const getTogetherClient = (): OpenAI => {
    if (!process.env.TOGETHER_API_KEY) {
        throw new Error("TOGETHER_API_KEY is not set");
    }
    if (!togetherClient) {
        togetherClient = new OpenAI({
            apiKey: process.env.TOGETHER_API_KEY,
            baseURL: TOGETHER_BASE_URL,
            timeout: parseInt(process.env.TOGETHER_TIMEOUT_SECONDS ?? process.env.OPEN_AI_TIMEOUT_SECONDS ?? "30") * 1000,
        });
    }
    return togetherClient;
};

export const defaultTogetherSettings = {
    temperature: 0.4,
    n: 1,
    max_completion_tokens: 8192,
} as ChatCompletionCreateParamsNonStreaming;

export const createTogetherChatCompletion = async (
    params: ChatCompletionCreateParamsNonStreaming,
    mode = "json"
): Promise<ChatCompletion.Choice[]> => {
    const settings = { ...params };
    // Together's OpenAI-compatible JSON mode is inconsistent across hosted OSS models.
    // Keep JSON validation in our parser and prompts instead of forcing response_format.
    return await backOff(async () => {
        const reply = await getTogetherClient().chat.completions.create(settings);
        return reply?.choices;
    }, retryOptions);
};

export const newTogetherCompletion = async (
    messages: ChatCompletionMessageParam[],
    model: string,
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await createTogetherChatCompletion({ ...defaultTogetherSettings, model, messages }, mode);

export const newTogetherKimiK25Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newTogetherCompletion(messages, "moonshotai/Kimi-K2.5", mode);

export const newTogetherGlm51Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newTogetherCompletion(messages, "zai-org/GLM-5.1", mode);

export const newTogetherMiniMaxM25Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newTogetherCompletion(messages, "MiniMaxAI/MiniMax-M2.5", mode);

export const newTogetherGptOss120bCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newTogetherCompletion(messages, "openai/gpt-oss-120b", mode);
