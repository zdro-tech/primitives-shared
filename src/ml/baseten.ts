import OpenAI from "openai";
import {
    ChatCompletion,
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionMessageParam,
} from "openai/resources/index";
import { backOff } from "exponential-backoff";
import { getTimeoutMs, retryOptions } from "./shared.js";

const BASETEN_BASE_URL = "https://inference.baseten.co/v1";

let basetenClient: OpenAI;

export const getBasetenClient = (): OpenAI => {
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
} as ChatCompletionCreateParamsNonStreaming;

export const createBasetenChatCompletion = async (
    params: ChatCompletionCreateParamsNonStreaming,
    mode = "json"
): Promise<ChatCompletion.Choice[]> => {
    const settings = { ...params };
    if (mode === "json") {
        settings.response_format = { type: "json_object" };
    }
    return await backOff(async () => {
        const reply = await getBasetenClient().chat.completions.create(settings);
        return reply?.choices;
    }, retryOptions);
};

export const newBasetenCompletion = async (
    messages: ChatCompletionMessageParam[],
    model: string,
    mode?: string,
    modelSettings: Partial<ChatCompletionCreateParamsNonStreaming> = {}
): Promise<ChatCompletion.Choice[]> =>
    await createBasetenChatCompletion({ ...defaultBasetenSettings, ...modelSettings, model, messages }, mode);

export const newBasetenKimiK25Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newBasetenCompletion(messages, "moonshotai/Kimi-K2.5", mode, {
        temperature: 1.0,
        top_p: 0.95,
    });

export const newBasetenGlm5Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newBasetenCompletion(messages, "zai-org/GLM-5", mode);
