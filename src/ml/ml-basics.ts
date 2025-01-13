import { ChatCompletionMessageParam, ChatCompletion, } from "openai/resources/index"
import { new35Completition, new4Completition, new4oCompletition, new4oMiniCompletition, newO1Completition, newO1MiniCompletition, visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";

import { ChatMessage, FileData, MessageAuthor } from "../types/chat-message.js";
import { Message, TextContentBlock } from "openai/resources/beta/threads/index.mjs";
import { newCloudeCompletion } from "./anthropic-cloude.js";
import { new4AzureCompletition } from "./azure-openai.js";
import { newGroqCompletion } from "./groq.js";

export enum ExecutionModel {
    AZURE_4_0 = "azure",
    GPT3_5_TURBO = "gpt-3.5-turbo",
    GPT4_TURBO = "gpt-4-turbo",
    GPT4_4O = "gpt-4o",
    GPT4_4O_MINI = "gpt-4o-mini",
    O1_MINI = "o1-mini",
    O1 = "O1",
    CLOUDE_3_OPUS = "claude-3-opus-20240229",
    CLOUDE_3_SONNET = "claude-3-sonnet-20240229",
    CLOUDE_3_HAIKU = "claude-3-haiku-20240307",
    GROQ_LLAMA_3_70B_8192 = "llama3-70b-8192",
    CUSTOM_4_CARE = "4.care.01",
    CUSTOM_4_CARE_DRUGS = "4.care.01-drugs",
}

export const anyOfModels = (array: ExecutionModel[]): ExecutionModel => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export const newMLCompletion = async (messages: Array<ChatCompletionMessageParam>, model: ExecutionModel): Promise<ChatCompletion.Choice[]> => {
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
            return await newCloudeCompletion(messages, ExecutionModel.CLOUDE_3_OPUS);
        }
        if (model === ExecutionModel.CLOUDE_3_HAIKU) {
            return await newCloudeCompletion(messages, ExecutionModel.CLOUDE_3_HAIKU);
        }
        if (model === ExecutionModel.CLOUDE_3_SONNET) {
            return await newCloudeCompletion(messages, ExecutionModel.CLOUDE_3_SONNET);
        }
        if (model === ExecutionModel.GROQ_LLAMA_3_70B_8192) {
            return await newGroqCompletion(messages, ExecutionModel.GROQ_LLAMA_3_70B_8192);
        }
    } catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
    }
    return await new4Completition(messages);
}

export const processMessages = async <T>(messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel, role = "system"): Promise<T> => {
    return parseFirstCompletion(await newMLCompletion(addPostInstructions(messages, language, role), model)) as T
};

const fileNameFileDescription = (file: FileData) => {
    return `${file.fileName}${file.fileDescription ? ` : ${file.fileDescription}` : ''}`
}

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
        messageText = `message: """ ${messageText} """, attached files: """ ${fileNamesAndDescription} """`
    }
    return messageText
}

export const filesToText = (message: ChatMessage) => {
    return `""" ${message?.files?.map(file => fileNameFileDescription(file)).join(', ') ?? ''} """`
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

export const getMessageRole = (message: any): string => {
    return message.author == MessageAuthor.Bot ? "assistant" : "user"
}

const useStrictlyLanguage = (language: string) => {
    switch (language) {
        case 'pl':
            return `Używaj i odpowiadaj ściśle w języku polskim.`;
        case 'uk':
            return `Використовуйте та відповідайте строго українською мовою.`;
        case 'ru':
            return `Используйте и отвечайте строго на русском языке.`;
        default:
            return `Use and reply strictly in ${language} language.`;
    }
}

export const addPostInstructions = (messages: Array<ChatCompletionMessageParam>, language: string, role = "system") => {
    messages.push({ "role": role, "content": useStrictlyLanguage(language) } as ChatCompletionMessageParam)
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
