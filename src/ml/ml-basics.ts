import { ChatCompletionMessageParam, ChatCompletion, } from "openai/resources/index"
import { new35Completition, new4Completition, new4oCompletition, new4oMiniCompletition, newO1Completition, newO1MiniCompletition, newO3MiniCompletition, newO3MiniHighCompletition, visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";

import { ChatMessage, FileData, MessageAuthor } from "../types/chat-message.js";
import { Message, TextContentBlock } from "openai/resources/beta/threads/index.mjs";
import { newClaudeCompletion } from "./anthropic-cloude.js";
import { new4AzureCompletition } from "./azure-openai.js";
import { newGroqCompletion } from "./groq.js";
import { newGCPCompletion } from "./gcp-ml.js";

export enum ExecutionModel {
    AZURE_4_0 = "azure",
    GPT3_5_TURBO = "gpt-3.5-turbo",
    GPT4_TURBO = "gpt-4-turbo",
    GPT4_4O = "gpt-4o",
    GPT4_4O_MINI = "gpt-4o-mini",
    O1_MINI = "o1-mini",
    O1 = "o1",
    O3_MINI = "o3-mini",
    O3_MINI_HIGH = "o3-mini-high",
    CLAUDE_3_OPUS = "claude-3-opus-latest",
    CLAUDE_3_5_SONNET = "claude-3-5-sonnet-latest",
    CLAUDE_3_7_SONNET = "claude-3-7-sonnet-latest",
    CLAUDE_3_5_HAIKU = "claude-3-5-haiku-latest",
    GROQ_DEEPSEEK_R1_DISTILL_LLAMA_70B = "deepseek-r1-distill-llama-70b",
    GROQ_DEEPSEEK_R1_DISTILL_LLAMA_70B_SPECDEC = "deepseek-r1-distill-llama-70b-specdec",
    GROQ_LLAMA_3_3_70B_SPECDEC = "llama-3.3-70b-specdec",
    GROQ_LLAMA_3_3_70B_VERSATILE = "llama-3.3-70b-versatile",
    GEMINI_2_0_FLASH = "gemini-2.0-flash",
    GEMINI_2_0_FLASH_LITE = "gemini-2.0-flash-lite",

}


export const anyOfModels = (array: ExecutionModel[]): ExecutionModel => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export const newMLCompletion = async (messages: Array<ChatCompletionMessageParam>, model: ExecutionModel, mode = "json"): Promise<ChatCompletion.Choice[]> => {
    try {
        if (model === ExecutionModel.AZURE_4_0) {
            return await new4AzureCompletition(messages);
        }
        if (model === ExecutionModel.GPT3_5_TURBO) {
            return await new35Completition(messages);
        }
        if (model === ExecutionModel.GPT4_TURBO) {
            return await new4Completition(messages, mode);
        }
        if (model === ExecutionModel.GPT4_4O) {
            return await new4oCompletition(messages, mode);
        }
        if (model === ExecutionModel.GPT4_4O_MINI) {
            return await new4oMiniCompletition(messages, mode);
        }
        if (model === ExecutionModel.O1) {
            return await newO1Completition(messages, mode);
        }
        if (model === ExecutionModel.O1_MINI) {
            return await newO1MiniCompletition(messages, mode);
        }
        if (model === ExecutionModel.O3_MINI) {
            return await newO3MiniCompletition(messages, mode);
        }
        if (model === ExecutionModel.O3_MINI_HIGH) {
            return await newO3MiniHighCompletition(messages, mode);
        }
        if (model === ExecutionModel.CLAUDE_3_OPUS) {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_3_OPUS, mode);
        }
        if (model === ExecutionModel.CLAUDE_3_5_HAIKU) {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_3_5_HAIKU, mode);
        }
        if (model === ExecutionModel.CLAUDE_3_5_SONNET) {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_3_5_SONNET, mode);
        }
        if (model === ExecutionModel.CLAUDE_3_7_SONNET) {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_3_7_SONNET, mode);
        }
        if (model === ExecutionModel.GROQ_DEEPSEEK_R1_DISTILL_LLAMA_70B) {
            return await newGroqCompletion(messages, ExecutionModel.GROQ_DEEPSEEK_R1_DISTILL_LLAMA_70B, mode);
        }
        if (model === ExecutionModel.GROQ_DEEPSEEK_R1_DISTILL_LLAMA_70B_SPECDEC) {
            return await newGroqCompletion(messages, ExecutionModel.GROQ_DEEPSEEK_R1_DISTILL_LLAMA_70B_SPECDEC, mode);
        }
        if (model === ExecutionModel.GROQ_LLAMA_3_3_70B_SPECDEC) {
            return await newGroqCompletion(messages, ExecutionModel.GROQ_LLAMA_3_3_70B_SPECDEC, mode);
        }
        if (model === ExecutionModel.GROQ_LLAMA_3_3_70B_VERSATILE) {
            return await newGroqCompletion(messages, ExecutionModel.GROQ_LLAMA_3_3_70B_VERSATILE, mode);
        }
        if (model === ExecutionModel.GEMINI_2_0_FLASH) {
            return await newGCPCompletion(messages, ExecutionModel.GEMINI_2_0_FLASH, mode);
        }
        if (model === ExecutionModel.GEMINI_2_0_FLASH_LITE) {
            return await newGCPCompletion(messages, ExecutionModel.GEMINI_2_0_FLASH_LITE, mode);
        }
    } catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
        try {
            return await newGCPCompletion(messages, ExecutionModel.GEMINI_2_0_FLASH, mode);
        } catch (e) {
            logger.error(`Error in in falling back competion to GCP ${model} with fallback`, e);
        }
        try {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_3_7_SONNET, mode);
        } catch (e) {
            logger.error(`Error in in falling back competion to Anthropic  ${model} with fallback`, e);
        }
    }
    return await new4oCompletition(messages, mode);
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

export const parseFirstCompletion = (choices: Array<ChatCompletion.Choice>): any => {
    const stringifiedJson = choices[0]?.message?.content ?? "{}";
    try {
        return JSON.parse(stringifiedJson)
    } catch (e) {
        logger.error(`JSON parse crash: ${stringifiedJson} and choises were`, choices)
        throw e
    }
}

export const cleanFirstCompletion = (choices: Array<ChatCompletion.Choice>): string => {
    const reply = choices[0]?.message?.content ?? "";
    return clearFromWrappingTags(reply)
};

export const clearFromWrappingTags = (text: string): string => {
    return text?.replace(/```(json|markdown)?/g, '')?.trim();
}

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

    return parseFirstCompletionWithPossibleMarkdown(await visionCompletion(addPostInstructions(messagesToSend, language, role))) as T
}

const parseFirstCompletionWithPossibleMarkdown = (choices: Array<ChatCompletion.Choice>): any => {
    let stringifiedJson = choices[0]?.message?.content;
    if (stringifiedJson) {
        const match = stringifiedJson.match(/```json\s*(.*?)\s*```/s);
        if (match && match[1]) {
            stringifiedJson = match[1];
        } else {
            logger.debug('Reply does not contain JSON in markdown', stringifiedJson);
        }
        return JSON.parse(stringifiedJson)
    }

}

export const parseAssistantMessageResponse = (message: Message): any => {
    const content = message?.content[0] as TextContentBlock
    return JSON.parse(content?.text?.value)
}
