import { ChatCompletionMessageParam, ChatCompletion, } from "openai/resources/index"
import { newO3MiniCompletition, newO3MiniHighCompletition, newGPT52Completition, newGPT52MiniCompletition, newGPT52ProCompletition, visionCompletion, newGPT52CodexCompletion, newGPT5NanoCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";

import { ChatMessage, FileData, MessageAuthor } from "../types/chat-message.js";
import { Message, TextContentBlock } from "openai/resources/beta/threads/index.mjs";
import { newClaudeCompletion } from "./anthropic-cloude.js";
import { newGroqCompletion, newGroqLlama4MaverickCompletion, newGroqLlama4ScoutCompletion } from "./groq.js";
import { newGemini3ProCompletion, newGemini3FlashCompletion } from "./gcp-ml.js";

export enum ExecutionModel {
    // OpenAI GPT-5 models (latest)
    GPT5_2 = "gpt-5.2", // Complex reasoning, broad world knowledge, and code-heavy or multi-step agentic tasks
    GPT5_2_PRO = "gpt-5.2-pro", // Tough problems that may take longer to solve but require harder thinking
    GPT5_2_CODEX = "gpt-5.2-codex", // Companies building interactive coding products; full spectrum of coding tasks
    GPT5_MINI = "gpt-5-mini", // Cost-optimized reasoning and chat; balances speed, cost, and capability
    GPT5_NANO = "gpt-5-nano", // High-throughput tasks, especially simple instruction-following or classification
    // OpenAI reasoning models (latest)
    O3_MINI = "o3-mini",
    O3_MINI_HIGH = "o3-mini-high",
    // Anthropic Claude 4.5 models (latest)
    CLAUDE_OPUS_4_5 = "claude-opus-4-5-20251124",
    CLAUDE_SONNET_4_5 = "claude-sonnet-4-5-20250929",
    CLAUDE_HAIKU_4_5 = "claude-haiku-4-5-20251015",
    // Groq models (latest)
    GROQ_LLAMA_3_3_70B_VERSATILE = "llama-3.3-70b-versatile",
    GROQ_LLAMA_4_MAVERICK = "meta-llama/llama-4-maverick-17b-128e-instruct",
    GROQ_LLAMA_4_SCOUT = "meta-llama/llama-4-scout-17b-16e-instruct",
    // Google Gemini 3 models (latest - December 2025)
    GEMINI_3_PRO = "gemini-3-pro",
    GEMINI_3_FLASH = "gemini-3-flash",
}


export const anyOfModels = (array: ExecutionModel[]): ExecutionModel => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export const newMLCompletion = async (messages: Array<ChatCompletionMessageParam>, model: ExecutionModel, mode = "json"): Promise<ChatCompletion.Choice[]> => {
    try {
        // OpenAI GPT-5 models (latest)
        if (model === ExecutionModel.GPT5_2) {
            return await newGPT52Completition(messages, mode);
        }
        if (model === ExecutionModel.GPT5_2_PRO) {
            return await newGPT52ProCompletition(messages, mode);
        }
        if (model === ExecutionModel.GPT5_2_CODEX) {
            return await newGPT52CodexCompletion(messages, mode);
        }
        if (model === ExecutionModel.GPT5_MINI) {
            return await newGPT52MiniCompletition(messages, mode);
        }
        if (model === ExecutionModel.GPT5_NANO) {
            return await newGPT5NanoCompletion(messages, mode);
        }
        // --- New completions for GPT-5.2-codex and GPT-5-nano ---
        // These should be implemented in openai.js
        // Example stub implementations below (replace with real API logic as needed):

        // In openai.js:
        // export const newGPT52CodexCompletion = async (messages, mode) => {
        //     // Implement actual API call for gpt-5.2-codex
        //     return await newGPT52Completition(messages, mode);
        // };

        // export const newGPT5NanoCompletion = async (messages, mode) => {
        //     // Implement actual API call for gpt-5-nano
        //     return await newGPT52MiniCompletition(messages, mode);
        // };
        // OpenAI reasoning models (latest)
        if (model === ExecutionModel.O3_MINI) {
            return await newO3MiniCompletition(messages, mode);
        }
        if (model === ExecutionModel.O3_MINI_HIGH) {
            return await newO3MiniHighCompletition(messages, mode);
        }
        // Anthropic Claude 4.5 models (latest)
        if (model === ExecutionModel.CLAUDE_OPUS_4_5) {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_OPUS_4_5, mode);
        }
        if (model === ExecutionModel.CLAUDE_SONNET_4_5) {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_SONNET_4_5, mode);
        }
        if (model === ExecutionModel.CLAUDE_HAIKU_4_5) {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_HAIKU_4_5, mode);
        }
        // Groq models (latest)
        if (model === ExecutionModel.GROQ_LLAMA_3_3_70B_VERSATILE) {
            return await newGroqCompletion(messages, ExecutionModel.GROQ_LLAMA_3_3_70B_VERSATILE, mode);
        }
        if (model === ExecutionModel.GROQ_LLAMA_4_MAVERICK) {
            return await newGroqLlama4MaverickCompletion(messages, mode);
        }
        if (model === ExecutionModel.GROQ_LLAMA_4_SCOUT) {
            return await newGroqLlama4ScoutCompletion(messages, mode);
        }
        // Google Gemini 3 models (latest)
        if (model === ExecutionModel.GEMINI_3_PRO) {
            return await newGemini3ProCompletion(messages, mode);
        }
        if (model === ExecutionModel.GEMINI_3_FLASH) {
            return await newGemini3FlashCompletion(messages, mode);
        }
    } catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
        try {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_SONNET_4_5, mode);
        } catch (e) {
            logger.error(`Error in in falling back competion to Anthropic ${model} with fallback`, e);
        }
        try {
            return await newGemini3ProCompletion(messages, mode);
        } catch (e) {
            logger.error(`Error in in falling back competion to GCP ${model} with fallback`, e);
        }
    }
    // Final fallback: use GPT-5.2 (most robust)
    return await newGPT52Completition(messages, mode);
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
