import { ChatCompletionMessageParam, ChatCompletion, } from "openai/resources/index"
import { visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";

import { ChatMessage, FileData, MessageAuthor } from "../types/chat-message.js";
import { Message, TextContentBlock } from "openai/resources/beta/threads/index.mjs";
import { newOpenrouterGemma431bCompletion, newOpenrouterGptOss120bCompletion, newOpenrouterKimiK26Completion } from "./openrouter.js";

export enum ExecutionModel {
    // OpenRouter models — each pinned to its top-3 throughput providers (primary + 2 fallbacks).
    OPENROUTER_GPT_OSS_120B = "openrouter/openai/gpt-oss-120b",
    OPENROUTER_GEMMA_4_31B = "openrouter/google/gemma-4-31b-it",
    OPENROUTER_KIMI_K2P6 = "openrouter/moonshotai/kimi-k2.6",
}


export const anyOfModels = (array: ExecutionModel[]): ExecutionModel => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export const newMLCompletion = async (messages: Array<ChatCompletionMessageParam>, model: ExecutionModel, mode = "json"): Promise<ChatCompletion.Choice[]> => {
    try {
        // OpenRouter models — provider-level throughput fallback handled inside each call.
        if (model === ExecutionModel.OPENROUTER_GPT_OSS_120B) {
            return await newOpenrouterGptOss120bCompletion(messages, mode);
        }
        if (model === ExecutionModel.OPENROUTER_GEMMA_4_31B) {
            return await newOpenrouterGemma431bCompletion(messages, mode);
        }
        if (model === ExecutionModel.OPENROUTER_KIMI_K2P6) {
            return await newOpenrouterKimiK26Completion(messages, mode);
        }
    } catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
    }
    // Final fallback: GPT-OSS-120B (Cerebras primary + Bedrock/Groq fallbacks).
    return await newOpenrouterGptOss120bCompletion(messages, mode);
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

const removeTerminalMarkers = (text: string): string => {
    return text.replace(/\s*\[EOS\]\s*$/i, "").trim();
};

export const parseFirstCompletion = (choices: Array<ChatCompletion.Choice>): any => {
    const stringifiedJson = removeTerminalMarkers(extractFromMarkdown(choices[0]?.message?.content ?? "{}"));

    try {
        return JSON.parse(stringifiedJson)
    } catch (e) {
        logger.error(`JSON parse crash: ${stringifiedJson} and choices were`, choices)
        throw e
    }
}

const cleanFirstCompletion = (choices: Array<ChatCompletion.Choice>): string => {
    return removeTerminalMarkers(extractFromMarkdown(choices[0]?.message?.content ?? ""));
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
