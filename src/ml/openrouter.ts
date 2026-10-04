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

// Gemma 4 31B — DeepInfra -> Parasail -> Novita -> Crusoe, ordered by measured latency and
// success rate (Crusoe was rate-limited upstream in every test). The faster hosts are 4-bit or keep data.
export const newOpenrouterGemma431bCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "google/gemma-4-31b-it", mode, {
        ...providerOrder(["DeepInfra", "Parasail", "Novita", "Crusoe"]),
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
// Morph (~10s per JSON reply) -> Together (~35s) -> Fireworks (~36s) -> Wafer (~46s).
export const newOpenrouterKimiK3Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "moonshotai/kimi-k3", mode, {
        temperature: 1.0,
        top_p: 0.95,
        ...providerOrder(["Morph", "Together", "Fireworks", "Wafer"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// GLM-5.2 — Together (~1.6s per JSON reply) -> Wafer (~8s) -> BaseTen -> Relace (both often rate-limited).
export const newOpenrouterGlm52Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "z-ai/glm-5.2", mode, {
        ...providerOrder(["Together", "Wafer", "BaseTen", "Relace"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// GLM-5.3 — Wafer (~2.8s per JSON reply) -> Parasail (~3.2s) -> Together (~1.7s) -> Modal (~5.6s) -> Fireworks (~8.3s).
// Together is fastest at the median but has stalled for 10-90s in earlier tests, so the steadier hosts go first.
// Friendli keeps data, so it is not ZDR-eligible.
// Reasoning is mandatory and defaults to max effort (~12s and ~1200 reasoning tokens for a
// one-line reply); low effort answers in 2-4s.
export const newOpenrouterGlm53Completion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "z-ai/glm-5.3", mode, {
        reasoning: { effort: "low" },
        ...providerOrder(["Wafer", "Parasail", "Together", "Modal", "Fireworks"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// DeepSeek V4.1 Flash — Together (~5.8s per JSON reply) -> BaseTen (~8.5s) -> Parasail (~8.6s) -> CoreWeave (~13.6s)
// -> Modal (rate-limited upstream in every test).
export const newOpenrouterDeepseekV41FlashCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "deepseek/deepseek-v4.1-flash", mode, {
        ...providerOrder(["Together", "BaseTen", "Parasail", "CoreWeave", "Modal"]),
    } as unknown as Partial<ChatCompletionCreateParamsNonStreaming>);

// Same model with reasoning switched off, for short extraction and classification calls
// where latency matters most (~0.8s; reasoning adds ~300 tokens per reply).
// Together (~1.7s) -> BaseTen (~2.6s) -> CoreWeave (~3.2s) -> Parasail (~5.4s) -> Modal.
export const newOpenrouterDeepseekV41FlashNoReasoningCompletion = async (
    messages: ChatCompletionMessageParam[],
    mode?: string
): Promise<ChatCompletion.Choice[]> =>
    await newOpenrouterCompletion(messages, "deepseek/deepseek-v4.1-flash", mode, {
        reasoning: { enabled: false },
        ...providerOrder(["Together", "BaseTen", "CoreWeave", "Parasail", "Modal"]),
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
