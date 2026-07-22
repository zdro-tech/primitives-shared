import OpenAI from "openai";
import { getTimeoutMs, retryOptions } from "./shared.js";
import { backOff } from "exponential-backoff";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
let openrouterClient;
export const getOpenrouterClient = () => {
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
};
// OpenRouter's non-standard `provider` field lets us pin an explicit upstream order:
// a primary provider plus two fallbacks, chosen by measured output throughput (t/s)
// for each specific model. allow_fallbacks keeps us up if all three are unavailable.
// Rankings captured 2026-07-22 from GET /models/{id}/endpoints (throughput_last_30m.p50).
const providerOrder = (order) => ({
    provider: { order, allow_fallbacks: true },
});
export const createOpenrouterChatCompletion = async (params, mode = "json") => {
    const settings = { ...params };
    if (mode === "json") {
        settings.response_format = { type: "json_object" };
    }
    return await backOff(async () => {
        const reply = await getOpenrouterClient().chat.completions.create(settings);
        return reply?.choices;
    }, retryOptions);
};
export const newOpenrouterCompletion = async (messages, model, mode, modelSettings = {}) => await createOpenrouterChatCompletion({ ...defaultOpenrouterSettings, ...modelSettings, model, messages }, mode);
// GPT-OSS-120B — Groq primary (best latency), then by throughput: Cerebras (478 t/s) -> Amazon Bedrock (347).
export const newOpenrouterGptOss120bCompletion = async (messages, mode) => await newOpenrouterCompletion(messages, "openai/gpt-oss-120b", mode, {
    temperature: 0.6,
    top_p: 0.95,
    ...providerOrder(["Groq", "Cerebras", "Amazon Bedrock"]),
});
// Gemma 4 31B — primary Cerebras (177 t/s) -> SambaNova (94) -> ModelRun (71).
export const newOpenrouterGemma431bCompletion = async (messages, mode) => await newOpenrouterCompletion(messages, "google/gemma-4-31b-it", mode, {
    ...providerOrder(["Cerebras", "SambaNova", "ModelRun"]),
});
// Kimi K2.6 — primary WandB (164 t/s) -> Together (109) -> ModelRun (81).
export const newOpenrouterKimiK26Completion = async (messages, mode) => await newOpenrouterCompletion(messages, "moonshotai/kimi-k2.6", mode, {
    temperature: 1.0,
    top_p: 0.95,
    ...providerOrder(["WandB", "Together", "ModelRun"]),
});
// Kimi K3 — newer/stronger than K2.6, but as of 2026-07-22 only Moonshot AI (first-party,
// ~28 t/s) hosts it on OpenRouter, so there are no throughput fallbacks yet and it can be
// rate-limited upstream. allow_fallbacks stays on to auto-widen once others pick it up.
export const newOpenrouterKimiK3Completion = async (messages, mode) => await newOpenrouterCompletion(messages, "moonshotai/kimi-k3", mode, {
    temperature: 1.0,
    top_p: 0.95,
    ...providerOrder(["Moonshot AI"]),
});
// GLM-5.2 — Wafer (106 t/s) -> Cloudflare (85) -> WandB (81).
export const newOpenrouterGlm52Completion = async (messages, mode) => await newOpenrouterCompletion(messages, "z-ai/glm-5.2", mode, {
    ...providerOrder(["Wafer", "Cloudflare", "WandB"]),
});
