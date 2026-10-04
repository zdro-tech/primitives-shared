import OpenAI from "openai";
import {
    ChatCompletion,
    ChatCompletionCreateParamsNonStreaming,
    ChatCompletionMessageParam,
} from "openai/resources/index";
import { getTimeoutMs, retryOptions } from "./shared.js";
import { backOff } from "exponential-backoff";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

let openrouterClient: OpenAI;

export const getOpenrouterClient = (): OpenAI => {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("OPENROUTER_API_KEY is not set");
    }
    if (!openrouterClient) {
        openrouterClient = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: OPENROUTER_BASE_URL,
            timeout: getTimeoutMs(process.env.OPENROUTER_TIMEOUT_SECONDS, process.env.OPEN_AI_TIMEOUT_SECONDS),
        });
    }
    return openrouterClient;
};

export const defaultOpenrouterSettings = {
    n: 1,
    max_completion_tokens: 8192,
} as ChatCompletionCreateParamsNonStreaming;

// OpenRouter's non-standard `provider` field lets us pin an explicit upstream order:
// a primary provider plus two fallbacks, chosen by measured output throughput (t/s)
// for each specific model. allow_fallbacks keeps us up if all three are unavailable.
// The quantization filter applies to those automatic fallbacks too, so a request never
// lands on a 4-bit endpoint. "unknown" stays allowed: most first-tier hosts don't report it.
// Rankings captured early October 2026 from GET /models/{id}/endpoints (throughput_last_30m.p50),
// restricted to endpoints that pass the quantization filter and support response_format.
const HIGH_PRECISION_QUANTIZATIONS = ["fp8", "fp16", "bf16", "fp32", "unknown"];

const providerOrder = (order: string[]) => ({
    provider: { order, allow_fallbacks: true, quantizations: HIGH_PRECISION_QUANTIZATIONS },
});

export const createOpenrouterChatCompletion = async (
    params: ChatCompletionCreateParamsNonStreaming,
    mode = "json"
): Promise<ChatCompletion.Choice[]> => {
    const settings = { ...params };
    if (mode === "json") {
        settings.response_format = { type: "json_object" };
    }
    return await backOff(async () => {
        const reply = await getOpenrouterClient().chat.completions.create(settings);
        return reply?.choices;
    }, retryOptions);
};

export const newOpenrouterCompletion = async (
    messages: ChatCompletionMessageParam[],
    model: string,
    mode?: string,
    modelSettings: Partial<ChatCompletionCreateParamsNonStreaming> = {}
): Promise<ChatCompletion.Choice[]> =>
    await createOpenrouterChatCompletion({ ...defaultOpenrouterSettings, ...modelSettings, model, messages }, mode);

// GPT-OSS-120B — Cerebras (673 t/s) -> Groq (250) -> DeepInfra (140).
export const newOpenrouterGptOss120bCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "openai/gpt-oss-120b", mode, {
        temperature: 0.6,
        top_p: 0.95,
        ...providerOrder(["Cerebras", "Groq", "DeepInfra"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// Gemma 4 31B — Friendli (69 t/s) -> SiliconFlow (27) -> Parasail (18). The faster hosts are 4-bit.
export const newOpenrouterGemma431bCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "google/gemma-4-31b-it", mode, {
        ...providerOrder(["Friendli", "SiliconFlow", "Parasail"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// Kimi K2.6 — Crusoe (74 t/s) -> Novita (55) -> Phala (54). Superseded by GLM-5.3.
export const newOpenrouterKimiK26Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "moonshotai/kimi-k2.6", mode, {
        temperature: 1.0,
        top_p: 0.95,
        ...providerOrder(["Crusoe", "Novita", "Phala"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// Kimi K3 — roughly GLM-5.3 quality at ~4x the output price; kept as an option only.
export const newOpenrouterKimiK3Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "moonshotai/kimi-k3", mode, {
        temperature: 1.0,
        top_p: 0.95,
        ...providerOrder(["Moonshot AI"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// GLM-5.2 — Wafer -> Cloudflare.
export const newOpenrouterGlm52Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "z-ai/glm-5.2", mode, {
        ...providerOrder(["Wafer", "Cloudflare"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// GLM-5.3 — Friendli (136 t/s) -> Together (131) -> Modal (113).
// Reasoning is mandatory and defaults to max effort (~12s and ~1200 reasoning tokens for a
// one-line reply); low effort answers in 2-4s.
export const newOpenrouterGlm53Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "z-ai/glm-5.3", mode, {
        reasoning: { effort: "low" },
        ...providerOrder(["Friendli", "Together", "Modal"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// DeepSeek V4.1 Flash — Together (231 t/s) -> BaseTen (193) -> Modal (141).
export const newOpenrouterDeepseekV41FlashCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "deepseek/deepseek-v4.1-flash", mode, {
        ...providerOrder(["Together", "BaseTen", "Modal"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);
