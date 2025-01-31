import { new35Completition, new4Completition, new4oCompletition, new4oMiniCompletition, newO1Completition, newO1MiniCompletition, visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";
import { MessageAuthor } from "../types/chat-message.js";
import { newClaudeCompletion } from "./anthropic-cloude.js";
import { new4AzureCompletition } from "./azure-openai.js";
import { newGroqCompletion } from "./groq.js";
export var ExecutionModel;
(function (ExecutionModel) {
    ExecutionModel["AZURE_4_0"] = "azure";
    ExecutionModel["GPT3_5_TURBO"] = "gpt-3.5-turbo";
    ExecutionModel["GPT4_TURBO"] = "gpt-4-turbo";
    ExecutionModel["GPT4_4O"] = "gpt-4o";
    ExecutionModel["GPT4_4O_MINI"] = "gpt-4o-mini";
    ExecutionModel["O1_MINI"] = "o1-mini";
    ExecutionModel["O1"] = "o1";
    ExecutionModel["O3_MINI"] = "o3-mini";
    ExecutionModel["CLOUDE_3_OPUS"] = "claude-3-opus-latest";
    ExecutionModel["CLOUDE_3_SONNET"] = "claude-3-5-sonnet-latest";
    ExecutionModel["CLOUDE_3_HAIKU"] = "claude-3-5-haiku-latest";
    ExecutionModel["GROQ_LLAMA_3_70B"] = "llama-3.3-70b-versatile";
    ExecutionModel["GROQ_LLAMA_3_8B"] = "llama-3.1-8b-instant";
    ExecutionModel["CUSTOM_4_CARE"] = "4.care.01";
    ExecutionModel["CUSTOM_4_CARE_DRUGS"] = "4.care.01-drugs";
})(ExecutionModel || (ExecutionModel = {}));
export const anyOfModels = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};
export const newMLCompletion = async (messages, model, mode = "json") => {
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
            return await newO1MiniCompletition(messages, mode);
        }
        if (model === ExecutionModel.CLOUDE_3_OPUS) {
            return await newClaudeCompletion(messages, ExecutionModel.CLOUDE_3_OPUS, mode);
        }
        if (model === ExecutionModel.CLOUDE_3_HAIKU) {
            return await newClaudeCompletion(messages, ExecutionModel.CLOUDE_3_HAIKU, mode);
        }
        if (model === ExecutionModel.CLOUDE_3_SONNET) {
            return await newClaudeCompletion(messages, ExecutionModel.CLOUDE_3_SONNET, mode);
        }
        if (model === ExecutionModel.GROQ_LLAMA_3_70B) {
            return await newGroqCompletion(messages, ExecutionModel.GROQ_LLAMA_3_70B);
        }
    }
    catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
    }
    return await new4Completition(messages);
};
export const processRawMessages = async (messages, language, model, role = "system", mode = "json") => {
    return cleanFirstCompletion(await newMLCompletion(messages, model, mode));
};
export const processMessages = async (messages, language, model, role = "system", mode = "json") => {
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
export const parseFirstCompletion = (choices) => {
    const stringifiedJson = choices[0]?.message?.content ?? "{}";
    try {
        return JSON.parse(stringifiedJson);
    }
    catch (e) {
        logger.error(`JSON parse crash: ${stringifiedJson} and choises were`, choices);
        throw e;
    }
};
export const cleanFirstCompletion = (choices) => {
    const reply = choices[0]?.message?.content ?? "";
    return reply.replace(/```(json|markdown)?/g, '').trim();
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
    return parseFirstCompletionWithPossibleMarkdown(await visionCompletion(addPostInstructions(messagesToSend, language, role)));
};
const parseFirstCompletionWithPossibleMarkdown = (choices) => {
    let stringifiedJson = choices[0]?.message?.content;
    if (stringifiedJson) {
        const match = stringifiedJson.match(/```json\s*(.*?)\s*```/s);
        if (match && match[1]) {
            stringifiedJson = match[1];
        }
        else {
            logger.debug('Reply does not contain JSON in markdown', stringifiedJson);
        }
        return JSON.parse(stringifiedJson);
    }
};
export const parseAssistantMessageResponse = (message) => {
    const content = message?.content[0];
    return JSON.parse(content?.text?.value);
};
