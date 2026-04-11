import { newGPT54Completion, newGPT54MiniCompletion, newGPT54NanoCompletion, visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";
import { MessageAuthor } from "../types/chat-message.js";
import { newClaudeCompletion } from "./anthropic-claude.js";
import { newGroqGptOss120bCompletion } from "./groq.js";
import { newGemini31ProCompletion, newGemini3ProCompletion, newGemini3FlashCompletion } from "./gcp-ml.js";
import { newFireworksDeepseekV3p1Completion, newFireworksGlm51Completion, newFireworksGptOss120bCompletion, newFireworksKimiK25Completion, newFireworksMiniMaxM25Completion } from "./fireworks.js";
import { newTogetherGlm51Completion, newTogetherGptOss120bCompletion, newTogetherKimiK25Completion, newTogetherMiniMaxM25Completion } from "./together.js";
export var ExecutionModel;
(function (ExecutionModel) {
    // OpenAI GPT-5.4 models
    ExecutionModel["GPT5_4"] = "gpt-5.4";
    ExecutionModel["GPT5_4_MINI"] = "gpt-5.4-mini";
    ExecutionModel["GPT5_4_NANO"] = "gpt-5.4-nano";
    // Anthropic Claude models (latest)
    ExecutionModel["CLAUDE_OPUS_4_6"] = "claude-opus-4-6";
    ExecutionModel["CLAUDE_SONNET_4_6"] = "claude-sonnet-4-6";
    // Groq models (latest)
    ExecutionModel["GROQ_GPT_OSS_120B"] = "openai/gpt-oss-120b";
    // Fireworks models
    ExecutionModel["FIREWORKS_DEEPSEEK_V3P1"] = "accounts/fireworks/models/deepseek-v3p1";
    ExecutionModel["FIREWORKS_KIMI_K2P5"] = "accounts/fireworks/models/kimi-k2p5";
    ExecutionModel["FIREWORKS_GLM_5P1"] = "accounts/fireworks/models/glm-5p1";
    ExecutionModel["FIREWORKS_GPT_OSS_120B"] = "accounts/fireworks/models/gpt-oss-120b";
    ExecutionModel["FIREWORKS_MINIMAX_M2P5"] = "accounts/fireworks/models/minimax-m2p5";
    // Together AI models
    ExecutionModel["TOGETHER_KIMI_K2P5"] = "moonshotai/Kimi-K2.5";
    ExecutionModel["TOGETHER_GLM_5P1"] = "zai-org/GLM-5.1";
    ExecutionModel["TOGETHER_MINIMAX_M2P5"] = "MiniMaxAI/MiniMax-M2.5";
    ExecutionModel["TOGETHER_GPT_OSS_120B"] = "together/openai/gpt-oss-120b";
    // Google Gemini 3 models (latest - December 2025)
    ExecutionModel["GEMINI_3_1_PRO"] = "gemini-3.1-pro-preview";
    ExecutionModel["GEMINI_3_PRO"] = "gemini-3-pro-preview";
    ExecutionModel["GEMINI_3_FLASH"] = "gemini-3-flash-preview";
})(ExecutionModel || (ExecutionModel = {}));
export const anyOfModels = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};
export const newMLCompletion = async (messages, model, mode = "json") => {
    try {
        // OpenAI GPT-5.4 models
        if (model === ExecutionModel.GPT5_4) {
            return await newGPT54Completion(messages, mode);
        }
        if (model === ExecutionModel.GPT5_4_MINI) {
            return await newGPT54MiniCompletion(messages, mode);
        }
        if (model === ExecutionModel.GPT5_4_NANO) {
            return await newGPT54NanoCompletion(messages, mode);
        }
        // Anthropic Claude models (latest)
        if (model === ExecutionModel.CLAUDE_OPUS_4_6) {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_OPUS_4_6, mode);
        }
        if (model === ExecutionModel.CLAUDE_SONNET_4_6) {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_SONNET_4_6, mode);
        }
        // Groq models (latest)
        if (model === ExecutionModel.GROQ_GPT_OSS_120B) {
            return await newGroqGptOss120bCompletion(messages, mode);
        }
        // Fireworks models
        if (model === ExecutionModel.FIREWORKS_DEEPSEEK_V3P1) {
            return await newFireworksDeepseekV3p1Completion(messages, mode);
        }
        if (model === ExecutionModel.FIREWORKS_KIMI_K2P5) {
            return await newFireworksKimiK25Completion(messages, mode);
        }
        if (model === ExecutionModel.FIREWORKS_GLM_5P1) {
            return await newFireworksGlm51Completion(messages, mode);
        }
        if (model === ExecutionModel.FIREWORKS_GPT_OSS_120B) {
            return await newFireworksGptOss120bCompletion(messages, mode);
        }
        if (model === ExecutionModel.FIREWORKS_MINIMAX_M2P5) {
            return await newFireworksMiniMaxM25Completion(messages, mode);
        }
        // Together AI models
        if (model === ExecutionModel.TOGETHER_KIMI_K2P5) {
            return await newTogetherKimiK25Completion(messages, mode);
        }
        if (model === ExecutionModel.TOGETHER_GLM_5P1) {
            return await newTogetherGlm51Completion(messages, mode);
        }
        if (model === ExecutionModel.TOGETHER_MINIMAX_M2P5) {
            return await newTogetherMiniMaxM25Completion(messages, mode);
        }
        if (model === ExecutionModel.TOGETHER_GPT_OSS_120B) {
            return await newTogetherGptOss120bCompletion(messages, mode);
        }
        // Google Gemini 3 models (latest)
        if (model === ExecutionModel.GEMINI_3_1_PRO) {
            return await newGemini31ProCompletion(messages, mode);
        }
        if (model === ExecutionModel.GEMINI_3_PRO) {
            return await newGemini3ProCompletion(messages, mode);
        }
        if (model === ExecutionModel.GEMINI_3_FLASH) {
            return await newGemini3FlashCompletion(messages, mode);
        }
    }
    catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
        try {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_SONNET_4_6, mode);
        }
        catch (e) {
            logger.error(`Error in in falling back competion to Anthropic ${model} with fallback`, e);
        }
        try {
            return await newGPT54MiniCompletion(messages, mode);
        }
        catch (e) {
            logger.error(`Error in in falling back competion to GCP ${model} with fallback`, e);
        }
    }
    // Final fallback
    return await newGemini31ProCompletion(messages, mode);
};
export const processRawMessages = async (messages, language, model, mode = "json") => {
    return cleanFirstCompletion(await newMLCompletion(messages, model, mode));
};
export const processMessages = async (messages, language, model, mode = "json") => {
    return parseFirstCompletion(await newMLCompletion(messages, model, mode));
};
export const chatMessagesToCompletionArray = (messages, messagesToSend = []) => {
    messages.forEach(m => {
        messagesToSend.push({ "role": getMessageRole(m), "content": chatMessageWithFilesToText(m) });
    });
    return messagesToSend;
};
export const chatMessageWithFilesToText = (message) => {
    let messageText = message.text;
    if (Array.isArray(message?.files) && message.files.length) {
        const fileNamesAndDescription = message.files.map(file => fileNameFileDescription(file)).join(', ');
        messageText = `${messageText}, (${fileNamesAndDescription})`;
    }
    return messageText;
};
const fileNameFileDescription = (file) => {
    return `${file.fileName}${file.fileDescription ? ` : ${file.fileDescription}` : ''}`;
};
export const processChatMessages = async (messages, instructions, language, model, role = "system") => {
    const messagesToSend = [{ "role": role, "content": instructions }];
    messages.forEach(m => {
        messagesToSend.push({ "role": getMessageRole(m), "content": chatMessageWithFilesToText(m) });
    });
    return parseFirstCompletion(await newMLCompletion(addPostInstructions(messagesToSend, language, role), model));
};
// Extract content from markdown code blocks (with or without language specifier)
const extractFromMarkdown = (text) => {
    const match = text.match(/```(?:json|markdown)?\s*([\s\S]*?)\s*```/);
    return match && match[1] ? match[1].trim() : text;
};
export const parseFirstCompletion = (choices) => {
    const stringifiedJson = extractFromMarkdown(choices[0]?.message?.content ?? "{}");
    try {
        return JSON.parse(stringifiedJson);
    }
    catch (e) {
        logger.error(`JSON parse crash: ${stringifiedJson} and choices were`, choices);
        throw e;
    }
};
const cleanFirstCompletion = (choices) => {
    return extractFromMarkdown(choices[0]?.message?.content ?? "");
};
export const getMessageRole = (message) => {
    return [MessageAuthor.Bot, MessageAuthor.Doctor].includes(message.author) ? "assistant" : "user";
};
export const addPostInstructions = (messages, language, role = "system") => {
    return messages;
};
export const processImage = async (base64Image, instructions, language, role = "system") => {
    const messagesToSend = [{ "role": role, "content": instructions }];
    messagesToSend.push({
        role: "user",
        content: [{
                type: "image_url",
                image_url: { url: base64Image }
            }]
    });
    return parseFirstCompletion(await visionCompletion(addPostInstructions(messagesToSend, language, role)));
};
export const parseAssistantMessageResponse = (message) => {
    const content = message?.content[0];
    return JSON.parse(content?.text?.value);
};
