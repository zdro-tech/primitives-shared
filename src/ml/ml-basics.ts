import { ChatCompletionMessageParam, ChatCompletion, } from "openai/resources/index"
import { newGPT54Completion, newGPT54MiniCompletion, newGPT54NanoCompletion, visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";

import { ChatMessage, FileData, MessageAuthor } from "../types/chat-message.js";
import { Message, TextContentBlock } from "openai/resources/beta/threads/index.mjs";
import { newClaudeCompletion } from "./anthropic-claude.js";
import { newGroqGptOss120bCompletion } from "./groq.js";
import { newGemini31ProCompletion, newGemini3ProCompletion, newGemini3FlashCompletion } from "./gcp-ml.js";
import { newFireworksDeepseekV3p1Completion, newFireworksGlm51Completion, newFireworksGptOss120bCompletion, newFireworksKimiK25Completion, newFireworksMiniMaxM25Completion } from "./fireworks.js";
import { newTogetherGlm51Completion, newTogetherGptOss120bCompletion, newTogetherKimiK25Completion, newTogetherMiniMaxM25Completion } from "./together.js";

export enum ExecutionModel {
    // OpenAI GPT-5.4 models
    GPT5_4 = "gpt-5.4",
    GPT5_4_MINI = "gpt-5.4-mini",
    GPT5_4_NANO = "gpt-5.4-nano",
    // Anthropic Claude models (latest)
    CLAUDE_OPUS_4_6 = "claude-opus-4-6",
    CLAUDE_SONNET_4_6 = "claude-sonnet-4-6",
    // Groq models (latest)
    GROQ_GPT_OSS_120B = "openai/gpt-oss-120b",
    // Fireworks models
    FIREWORKS_DEEPSEEK_V3P1 = "accounts/fireworks/models/deepseek-v3p1",
    FIREWORKS_KIMI_K2P5 = "accounts/fireworks/models/kimi-k2p5",
    FIREWORKS_GLM_5P1 = "accounts/fireworks/models/glm-5p1",
    FIREWORKS_GPT_OSS_120B = "accounts/fireworks/models/gpt-oss-120b",
    FIREWORKS_MINIMAX_M2P5 = "accounts/fireworks/models/minimax-m2p5",
    // Together AI models
    TOGETHER_KIMI_K2P5 = "moonshotai/Kimi-K2.5",
    TOGETHER_GLM_5P1 = "zai-org/GLM-5.1",
    TOGETHER_MINIMAX_M2P5 = "MiniMaxAI/MiniMax-M2.5",
    TOGETHER_GPT_OSS_120B = "together/openai/gpt-oss-120b",
    // Google Gemini 3 models (latest - December 2025)
    GEMINI_3_1_PRO = "gemini-3.1-pro-preview",
    GEMINI_3_PRO = "gemini-3-pro-preview",
    GEMINI_3_FLASH = "gemini-3-flash-preview",
}


export const anyOfModels = (array: ExecutionModel[]): ExecutionModel => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export const newMLCompletion = async (messages: Array<ChatCompletionMessageParam>, model: ExecutionModel, mode = "json"): Promise<ChatCompletion.Choice[]> => {
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
    } catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
        try {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_SONNET_4_6, mode);
        } catch (e) {
            logger.error(`Error in in falling back competion to Anthropic ${model} with fallback`, e);
        }
        try {
            return await newGPT54MiniCompletion(messages, mode);
        } catch (e) {
            logger.error(`Error in in falling back competion to GCP ${model} with fallback`, e);
        }
    }
    // Final fallback
    return await newGemini31ProCompletion(messages, mode);
}

export const processRawMessages = async (messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel, mode = "json"): Promise<string> => {
    return cleanFirstCompletion(await newMLCompletion(messages, model, mode))
};

export const processMessages = async <T>(messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel, mode = "json"): Promise<T> => {
    return parseFirstCompletion(await newMLCompletion(messages, model, mode)) as T
};

export const chatMessagesToCompletionArray = (messages: Array<ChatMessage>, messagesToSend: Array<ChatCompletionMessageParam> = []) => {
    messages.forEach(m => {
        messagesToSend.push({ "role": getMessageRole(m), "content": chatMessageWithFilesToText(m) } as ChatCompletionMessageParam);
    });
    return messagesToSend
}

export const chatMessageWithFilesToText = (message: ChatMessage) => {
    let messageText = message.text
    if (Array.isArray(message?.files) && message.files.length) {
        const fileNamesAndDescription = message.files.map(file => fileNameFileDescription(file)).join(', ')
        messageText = `${messageText}, (${fileNamesAndDescription})`
    }
    return messageText
}
const fileNameFileDescription = (file: FileData) => {
    return `${file.fileName}${file.fileDescription ? ` : ${file.fileDescription}` : ''}`
}

export const processChatMessages = async <T>(messages: Array<ChatMessage>, instructions: string, language: string, model: ExecutionModel, role = "system"): Promise<T> => {
    const messagesToSend = [{ "role": role, "content": instructions }] as Array<ChatCompletionMessageParam>;
    messages.forEach(m => {
        messagesToSend.push({ "role": getMessageRole(m), "content": chatMessageWithFilesToText(m) } as ChatCompletionMessageParam);
    });
    return parseFirstCompletion(await newMLCompletion(addPostInstructions(messagesToSend, language, role), model)) as T
};

// Extract content from markdown code blocks (with or without language specifier)
const extractFromMarkdown = (text: string): string => {
    const match = text.match(/```(?:json|markdown)?\s*([\s\S]*?)\s*```/);
    return match && match[1] ? match[1].trim() : text;
};

export const parseFirstCompletion = (choices: Array<ChatCompletion.Choice>): any => {
    const stringifiedJson = extractFromMarkdown(choices[0]?.message?.content ?? "{}");

    try {
        return JSON.parse(stringifiedJson)
    } catch (e) {
        logger.error(`JSON parse crash: ${stringifiedJson} and choices were`, choices)
        throw e
    }
}

const cleanFirstCompletion = (choices: Array<ChatCompletion.Choice>): string => {
    return extractFromMarkdown(choices[0]?.message?.content ?? "");
};

export const getMessageRole = (message: any): string => {
    return [MessageAuthor.Bot, MessageAuthor.Doctor].includes(message.author) ? "assistant" : "user"
}

export const addPostInstructions = (messages: Array<ChatCompletionMessageParam>, language: string, role = "system") => {
    return messages
}

export const processImage = async <T>(base64Image: string, instructions: string, language: string, role = "system"): Promise<T> => {
    const messagesToSend = [{ "role": role, "content": instructions }] as Array<ChatCompletionMessageParam>;
    messagesToSend.push({
        role: "user",
        content: [{
            type: "image_url",
            image_url: { url: base64Image }
        }]
    } as ChatCompletionMessageParam)

    return parseFirstCompletion(await visionCompletion(addPostInstructions(messagesToSend, language, role))) as T
}

export const parseAssistantMessageResponse = (message: Message): any => {
    const content = message?.content[0] as TextContentBlock
    return JSON.parse(content?.text?.value)
}
