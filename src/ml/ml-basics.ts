import { ChatCompletionMessageParam, ChatCompletion, } from "openai/resources/index"
import { new35Completition, new4Completition, new4oCompletition, new4oMiniCompletition, newO1Completition, newO1MiniCompletition, visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";

import { ChatMessage, FileData, MessageAuthor } from "../types/chat-message.js";
import { Message, TextContentBlock } from "openai/resources/beta/threads/index.mjs";
import { newClaudeCompletion } from "./anthropic-cloude.js";
import { new4AzureCompletition } from "./azure-openai.js";
import { newGroqCompletion } from "./groq.js";

export enum ExecutionModel {
    AZURE_4_0 = "azure",
    GPT3_5_TURBO = "gpt-3.5-turbo",
    GPT4_TURBO = "gpt-4-turbo",
    GPT4_4O = "gpt-4o",
    GPT4_4O_MINI = "gpt-4o-mini",
    O1_MINI = "o1-mini",
    O1 = "o1",
    CLOUDE_3_OPUS = "claude-3-opus-latest",
    CLOUDE_3_SONNET = "claude-3-5-sonnet-latest",
    CLOUDE_3_HAIKU = "claude-3-5-haiku-latest",
    GROQ_LLAMA_3_70B = "llama-3.3-70b-versatile",
    GROQ_LLAMA_3_8B = "llama-3.1-8b-instant",
    CUSTOM_4_CARE = "4.care.01",
    CUSTOM_4_CARE_DRUGS = "4.care.01-drugs",
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
            return await new4Completition(messages);
        }
        if (model === ExecutionModel.GPT4_4O) {
            return await new4oCompletition(messages);
        }
        if (model === ExecutionModel.GPT4_4O_MINI) {
            return await new4oMiniCompletition(messages);
        }
        if (model === ExecutionModel.O1) {
            return await newO1Completition(messages);
        }
        if (model === ExecutionModel.O1_MINI) {
            return await newO1MiniCompletition(messages);
        }
        if (model === ExecutionModel.CLOUDE_3_OPUS) {
            return await newClaudeCompletion(messages, ExecutionModel.CLOUDE_3_OPUS);
        }
        if (model === ExecutionModel.CLOUDE_3_HAIKU) {
            return await newClaudeCompletion(messages, ExecutionModel.CLOUDE_3_HAIKU);
        }
        if (model === ExecutionModel.CLOUDE_3_SONNET) {
            return await newClaudeCompletion(messages, ExecutionModel.CLOUDE_3_SONNET);
        }
        if (model === ExecutionModel.GROQ_LLAMA_3_70B) {
            return await newGroqCompletion(messages, ExecutionModel.GROQ_LLAMA_3_70B);
        }
    } catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
    }
    return await new4Completition(messages);
}

export const processRawMessages = async (messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel, role = "system"): Promise<string> => {
    return cleanFirstCompletion(await newMLCompletion(addPostInstructions(messages, language, role), model))
};

export const processMessages = async <T>(messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel, role = "system"): Promise<T> => {
    return parseFirstCompletion(await newMLCompletion(addPostInstructions(messages, language, role), model)) as T
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
    return reply.replace(/```(json|markdown)?/g, '').trim();
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
