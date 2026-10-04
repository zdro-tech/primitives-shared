import { ChatCompletionMessageParam, ChatCompletion, } from "openai/resources/index"
import { visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";

import { ChatMessage, FileData, MessageAuthor } from "../types/chat-message.js";
import { Message, TextContentBlock } from "openai/resources/beta/threads/index.mjs";
import { newOpenrouterDeepseekV41FlashCompletion, newOpenrouterDeepseekV41FlashNoReasoningCompletion, newOpenrouterGemma431bCompletion, newOpenrouterGlm52Completion, newOpenrouterGlm53Completion, newOpenrouterGptOss120bCompletion, newOpenrouterKimiK26Completion, newOpenrouterKimiK3Completion } from "./openrouter.js";

export enum ExecutionModel {
    // OpenRouter models — each pinned to its top-3 throughput providers (primary + 2 fallbacks).
    OPENROUTER_GPT_OSS_120B = "openrouter/openai/gpt-oss-120b",
    OPENROUTER_GEMMA_4_31B = "openrouter/google/gemma-4-31b-it",
    OPENROUTER_KIMI_K2P6 = "openrouter/moonshotai/kimi-k2.6",
    OPENROUTER_KIMI_K3 = "openrouter/moonshotai/kimi-k3",
    OPENROUTER_GLM_5_2 = "openrouter/z-ai/glm-5.2",
    OPENROUTER_GLM_5_3 = "openrouter/z-ai/glm-5.3",
    OPENROUTER_DEEPSEEK_V4P1_FLASH = "openrouter/deepseek/deepseek-v4.1-flash",
    OPENROUTER_DEEPSEEK_V4P1_FLASH_NO_REASONING = "openrouter/deepseek/deepseek-v4.1-flash:no-reasoning",
}


export const anyOfModels = (array: ExecutionModel[]): ExecutionModel => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

type Completion = (messages: Array<ChatCompletionMessageParam>, mode?: string) => Promise<ChatCompletion.Choice[]>;

const completions: Record<ExecutionModel, Completion> = {
    [ExecutionModel.OPENROUTER_GPT_OSS_120B]: newOpenrouterGptOss120bCompletion,
    [ExecutionModel.OPENROUTER_GEMMA_4_31B]: newOpenrouterGemma431bCompletion,
    [ExecutionModel.OPENROUTER_KIMI_K2P6]: newOpenrouterKimiK26Completion,
    [ExecutionModel.OPENROUTER_KIMI_K3]: newOpenrouterKimiK3Completion,
    [ExecutionModel.OPENROUTER_GLM_5_2]: newOpenrouterGlm52Completion,
    [ExecutionModel.OPENROUTER_GLM_5_3]: newOpenrouterGlm53Completion,
    [ExecutionModel.OPENROUTER_DEEPSEEK_V4P1_FLASH]: newOpenrouterDeepseekV41FlashCompletion,
    [ExecutionModel.OPENROUTER_DEEPSEEK_V4P1_FLASH_NO_REASONING]: newOpenrouterDeepseekV41FlashNoReasoningCompletion,
};

// Tried in order after the requested model. Three different model families on different
// hosts, so a single deprecation or provider outage cannot take out the whole chain.
const FALLBACK_MODELS = [
    ExecutionModel.OPENROUTER_GLM_5_3,
    ExecutionModel.OPENROUTER_DEEPSEEK_V4P1_FLASH,
    ExecutionModel.OPENROUTER_GPT_OSS_120B,
];

// A reply the caller cannot parse counts as a failure of that model, so the next one gets a turn.
const assertUsableCompletion = (choices: Array<ChatCompletion.Choice>, mode: string) => {
    const content = choices?.[0]?.message?.content;
    if (!content?.trim()) {
        throw new Error("Empty completion");
    }
    if (mode === "json") {
        parseJsonContent(content);
    }
};

export const newMLCompletion = async (messages: Array<ChatCompletionMessageParam>, model: ExecutionModel, mode = "json"): Promise<ChatCompletion.Choice[]> => {
    const chain = [model, ...FALLBACK_MODELS.filter(fallback => fallback !== model)];
    let lastError: unknown;
    for (const candidate of chain) {
        try {
            const choices = await completions[candidate](messages, mode);
            assertUsableCompletion(choices, mode);
            return choices;
        } catch (e) {
            lastError = e;
            logger.error(`Error in newMLCompletion ${candidate}`, e);
        }
    }
    throw lastError;
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

// Models occasionally wrap the JSON in prose ("Sure, here it is: {...}"), so when the whole
// reply does not parse, take the first embedded object or array that does.
const embeddedJson = (text: string): unknown => {
    for (let start = 0; start < text.length; start++) {
        const closer = text[start] === "{" ? "}" : text[start] === "[" ? "]" : undefined;
        if (!closer) {
            continue;
        }
        for (let end = text.lastIndexOf(closer); end > start; end = text.lastIndexOf(closer, end - 1)) {
            try {
                return JSON.parse(text.slice(start, end + 1));
            } catch {
                // keep shrinking
            }
        }
    }
    return undefined;
};

const parseJsonContent = (content: string): any => {
    const stringifiedJson = removeTerminalMarkers(extractFromMarkdown(content));
    try {
        return JSON.parse(stringifiedJson)
    } catch (e) {
        const embedded = embeddedJson(stringifiedJson);
        if (embedded === undefined) {
            throw e;
        }
        return embedded;
    }
};

export const parseFirstCompletion = (choices: Array<ChatCompletion.Choice>): any => {
    const content = choices[0]?.message?.content ?? "{}";
    try {
        return parseJsonContent(content)
    } catch (e) {
        logger.error(`JSON parse crash: ${content} and choices were`, choices)
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
