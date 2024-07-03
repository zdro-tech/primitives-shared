import { ChatCompletionMessageParam, ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessage, } from "openai/resources/index"
import { backOff, BackoffOptions } from "exponential-backoff";
import { defaultOpenAISettings, openAIClient } from "./openai.js";
import { logger } from "../logger/logger.js";
import { ChatRequestMessage, GetChatCompletionsOptions } from "@azure/openai";
import { azureOpenai, defaultAzureSettings } from "./azure-openai.js";
import { ChatMessage, MessageAuthor } from "../types/chat-message.js";
import { Message, TextContentBlock } from "openai/resources/beta/threads/index.mjs";
import { anthropic, defaultCloudeSettings } from "./anthropic-cloude.js";
import { MessageCreateParamsNonStreaming, MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";

const retryOptions: BackoffOptions = {
    retry: (error: Error, attemptNumber: number) => {
        logger.debug("Retrying openai request, attempt: " + attemptNumber + " error: ", error);
        return error.message.includes('timed out');
    },
    numOfAttempts: 2
};

export enum ExecutionModel {
    AZURE_4_0 = "azure",
    GPT3_5_TURBO = "gpt-3.5-turbo",
    GPT4_TURBO = "gpt-4-turbo",
    GPT4_4O = "gpt-4o",
    CLOUDE_3_OPUS = "claude-3-opus-20240229",
    CLOUDE_3_SONNET = "claude-3-sonnet-20240229",
    CLOUDE_3_HAIKU = "claude-3-haiku-20240307",
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
        if (model === ExecutionModel.CLOUDE_3_OPUS) {
            return await newCloudeCompletion(messages, ExecutionModel.CLOUDE_3_OPUS);
        }
        if (model === ExecutionModel.CLOUDE_3_HAIKU) {
            return await newCloudeCompletion(messages, ExecutionModel.CLOUDE_3_HAIKU);
        }
        if (model === ExecutionModel.CLOUDE_3_SONNET) {
            return await newCloudeCompletion(messages, ExecutionModel.CLOUDE_3_SONNET);
        }
    } catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
    }
    return await new4Completition(messages);
}

export const newCloudeCompletion = async (messages: Array<ChatCompletionMessageParam>, model: string): Promise<ChatCompletion.Choice[]> => {
    const systemMessage = messages.filter(m => m.role === "system").map(m => m.content).join(". ") + " Return only valid JSON and nothng else."
    const cloudeMessages = messages.filter(m => m.role !== "system") as Array<MessageParam>
    cloudeMessages.push({
        "role": "assistant",
        "content": "{"
    })
    const message = await anthropic.messages.create({
        ...defaultCloudeSettings, ...{ model, messages: cloudeMessages, system: systemMessage }
    } as MessageCreateParamsNonStreaming);
    return [{ message: { content: message.content[0].text } as ChatCompletionMessage }] as ChatCompletion.Choice[]
}

export const new4AzureCompletition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
    const { choices } = await azureOpenai.getChatCompletions(
        "aloe-chat", messages as ChatRequestMessage[],
        {
            ...defaultAzureSettings as GetChatCompletionsOptions
        });
    return choices as unknown as ChatCompletion.Choice[]
}

const new35Completition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
    return await backOff(async () => {
        const reply = await openAIClient.chat.completions.create({
            ...defaultOpenAISettings,
            model: "gpt-3.5-turbo-0125",
            max_tokens: 1000,
            messages: messages
        })
        return reply?.choices
    }, retryOptions)
}

const new4oCompletition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
    return await backOff(async () => {
        const reply = await openAIClient.chat.completions.create({
            ...defaultOpenAISettings,
            model: "gpt-4o",
            messages: messages
        })
        return reply?.choices
    }, retryOptions)
}

const new4Completition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
    return await backOff(async () => {
        const reply = await openAIClient.chat.completions.create({
            ...defaultOpenAISettings,
            model: "gpt-4-turbo",
            messages: messages
        })
        return reply?.choices
    }, retryOptions)
}

export const processMessages = async <T>(messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel): Promise<T> => {
    return parseFirstCompletion(await newMLCompletion(addPostInstructions(messages, language), model)) as T
};

export const processChatMessages = async <T>(messages: Array<ChatMessage>, instructions: string, language: string, model: ExecutionModel): Promise<T> => {
    const messagesToSend = [{ "role": "system", "content": instructions }] as Array<ChatCompletionMessageParam>;
    messages.forEach(m => {
        messagesToSend.push({ "role": getMessageRole(m), "content": m.text } as ChatCompletionMessageParam);
    });
    return parseFirstCompletion(await newMLCompletion(addPostInstructions(messagesToSend, language), model)) as T
};

export const processChatMessage = async <T>(message: ChatMessage, instructions: string, language: string, model: ExecutionModel): Promise<T> => {
    const messagesToSend = [{ "role": "system", "content": instructions }] as Array<ChatCompletionMessageParam>;
    messagesToSend.push({ "role": getMessageRole(message), "content": message.text } as ChatCompletionMessageParam);
    return parseFirstCompletion(await newMLCompletion(addPostInstructions(messagesToSend, language), model)) as T
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

export const addPostInstructions = (messages: Array<ChatCompletionMessageParam>, language: string) => {
    messages.push({ "role": "system", "content": `Use and reply strictly in ${language} language.` } as ChatCompletionMessageParam)
    return messages
}

export const visionCompletion = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
    return await backOff(async () => {
        const reply = await openAIClient.chat.completions.create({
            model: "gpt-4-vision-preview",
            max_tokens: 1000,
            messages: messages
        });
        return reply?.choices;
    }, retryOptions);
};

export const processImage = async <T>(base64Image: string, instructions: string, language: string): Promise<T> => {
    const messagesToSend = [{ "role": "system", "content": instructions }] as Array<ChatCompletionMessageParam>;
    messagesToSend.push({
        role: "user",
        content: [{
            type: "image_url",
            image_url: { url: base64Image }
        }]
    } as ChatCompletionMessageParam)

    return parseFirstCompletionWithPossibleMarkdown(await visionCompletion(addPostInstructions(messagesToSend, language))) as T
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
