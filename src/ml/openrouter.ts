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

// OpenRouter's non-standard `provider` field pins an explicit allowlist: a primary provider
// plus at least three fallbacks, chosen by time to first token, output throughput and uptime
// for each specific model. Requests never leave that list (allow_fallbacks: false) and only
// reach endpoints that retain no prompts or completions (zdr) and never train on them
// (data_collection: deny); model-level fallbacks in ml-basics cover a full outage.
// The quantization filter keeps requests off 4-bit endpoints. "unknown" stays allowed: most
// first-tier hosts don't report it.
// Rankings captured early October 2026 from GET /models/{id}/endpoints (throughput_last_30m.p50,
// latency_last_30m.p50), restricted to endpoints listed by GET /endpoints/zdr that pass the
// quantization filter and support response_format.
const HIGH_PRECISION_QUANTIZATIONS = ["fp8", "fp16", "bf16", "fp32", "unknown"];

export const privateRouting = {
    zdr: true,
    data_collection: "deny",
    allow_fallbacks: false,
};

const providerOrder = (order: string[]) => ({
    provider: { ...privateRouting, order, only: order, quantizations: HIGH_PRECISION_QUANTIZATIONS },
});

export const createOpenrouterChatCompletion = async (
    params: ChatCompletionCreateParamsNonStreaming,
    mode = "json"
): Promise<ChatCompletion.Choice[]> => {
    const provider = (params as { provider?: object }).provider;
    const settings = { ...params, provider: { ...provider, ...privateRouting } } as ChatCompletionCreateParamsNonStreaming;
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

// GPT-OSS-120B — Cerebras (538 t/s) -> Groq (306) -> Crusoe (149) -> DeepInfra (96).
export const newOpenrouterGptOss120bCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "openai/gpt-oss-120b", mode, {
        temperature: 0.6,
        top_p: 0.95,
        ...providerOrder(["Cerebras", "Groq", "Crusoe", "DeepInfra"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// Gemma 4 31B — Crusoe -> DeepInfra -> Parasail -> Novita, ordered by latency and uptime
// (all ~15-20 t/s). The faster hosts are 4-bit or keep data.
export const newOpenrouterGemma431bCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "google/gemma-4-31b-it", mode, {
        ...providerOrder(["Crusoe", "DeepInfra", "Parasail", "Novita"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// Kimi K2.6 — Novita (64 t/s) -> Phala (42) -> Crusoe (17). Superseded by GLM-5.3.
// No other ZDR, non-4-bit host supports json_object.
export const newOpenrouterKimiK26Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "moonshotai/kimi-k2.6", mode, {
        temperature: 1.0,
        top_p: 0.95,
        ...providerOrder(["Novita", "Phala", "Crusoe"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// Kimi K3 — roughly GLM-5.3 quality at ~4x the output price; kept as an option only.
// Fireworks (94 t/s) -> Together (51) -> Wafer (50) -> Morph (47).
export const newOpenrouterKimiK3Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "moonshotai/kimi-k3", mode, {
        temperature: 1.0,
        top_p: 0.95,
        ...providerOrder(["Fireworks", "Together", "Wafer", "Morph"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// GLM-5.2 — Wafer (120 t/s) -> BaseTen (127) -> Together (91) -> Relace (111).
export const newOpenrouterGlm52Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "z-ai/glm-5.2", mode, {
        ...providerOrder(["Wafer", "BaseTen", "Together", "Relace"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// GLM-5.3 — Fireworks (129 t/s) -> Modal (106) -> Wafer (88) -> Parasail (92) -> Together (136).
// Together is last: it ranked fastest but timed out or took 10-90s in repeated tests.
// Friendli keeps data, so it is not ZDR-eligible.
// Reasoning is mandatory and defaults to max effort (~12s and ~1200 reasoning tokens for a
// one-line reply); low effort answers in 2-4s.
export const newOpenrouterGlm53Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "z-ai/glm-5.3", mode, {
        reasoning: { effort: "low" },
        ...providerOrder(["Fireworks", "Modal", "Wafer", "Parasail", "Together"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// DeepSeek V4.1 Flash — Together (229 t/s) -> BaseTen (167) -> Modal (188) -> Parasail (201) -> CoreWeave (164).
export const newOpenrouterDeepseekV41FlashCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "deepseek/deepseek-v4.1-flash", mode, {
        ...providerOrder(["Together", "BaseTen", "Modal", "Parasail", "CoreWeave"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// Same model with reasoning switched off, for short extraction and classification calls
// where latency matters most (~0.8s; reasoning adds ~300 tokens per reply).
export const newOpenrouterDeepseekV41FlashNoReasoningCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "deepseek/deepseek-v4.1-flash", mode, {
        reasoning: { enabled: false },
        ...providerOrder(["Together", "BaseTen", "Modal", "Parasail", "CoreWeave"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// Same model and vectors as OpenAI's text-embedding-3-large, served by Azure under ZDR.
export const createOpenrouterEmbeddings = async (input: string | string[], model: string): Promise<number[][]> =>
    await backOff(async () => {
        const reply = await getOpenrouterClient().embeddings.create({
            model: `openai/${model}`,
            input,
            provider: { ...privateRouting, only: ["Azure"] },
        } as Parameters<OpenAI["embeddings"]["create"]>[0]);
        return reply?.data.map(item => item.embedding);
    }, retryOptions);
