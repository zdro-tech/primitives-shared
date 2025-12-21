import { new35Completition, new4Completition, new4oCompletition, new4oMiniCompletition, newO1Completition, newO1MiniCompletition, newO3MiniCompletition, newO3MiniHighCompletition, newGPT52Completition, newGPT52ProCompletition, visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";
import { MessageAuthor } from "../types/chat-message.js";
import { newClaudeCompletion } from "./anthropic-cloude.js";
import { new4AzureCompletition } from "./azure-openai.js";
import { newGroqCompletion, newGroqLlama4MaverickCompletion, newGroqLlama4ScoutCompletion } from "./groq.js";
import { newGCPCompletion, newGemini3ProCompletion, newGemini3FlashCompletion, newGemini25ProCompletion, newGemini25FlashCompletion } from "./gcp-ml.js";
export var ExecutionModel;
(function (ExecutionModel) {
    // Azure
    ExecutionModel["AZURE_4_0"] = "azure";
    // OpenAI GPT models (legacy)
    ExecutionModel["GPT3_5_TURBO"] = "gpt-3.5-turbo";
    ExecutionModel["GPT4_TURBO"] = "gpt-4-turbo";
    ExecutionModel["GPT4_4O"] = "gpt-4o";
    ExecutionModel["GPT4_4O_MINI"] = "gpt-4o-mini";
    // OpenAI GPT-5 models (latest)
    ExecutionModel["GPT5_2"] = "gpt-5.2";
    ExecutionModel["GPT5_2_PRO"] = "gpt-5.2-pro";
    // OpenAI reasoning models
    ExecutionModel["O1_MINI"] = "o1-mini";
    ExecutionModel["O1"] = "o1";
    ExecutionModel["O3_MINI"] = "o3-mini";
    ExecutionModel["O3_MINI_HIGH"] = "o3-mini-high";
    // Anthropic Claude 3.x models (legacy)
    ExecutionModel["CLAUDE_3_OPUS"] = "claude-3-opus-latest";
    ExecutionModel["CLAUDE_3_5_SONNET"] = "claude-3-5-sonnet-latest";
    ExecutionModel["CLAUDE_3_7_SONNET"] = "claude-3-7-sonnet-latest";
    ExecutionModel["CLAUDE_3_5_HAIKU"] = "claude-3-5-haiku-latest";
    // Anthropic Claude 4.5 models (latest)
    ExecutionModel["CLAUDE_OPUS_4_5"] = "claude-opus-4-5-20251124";
    ExecutionModel["CLAUDE_SONNET_4_5"] = "claude-sonnet-4-5-20250929";
    ExecutionModel["CLAUDE_HAIKU_4_5"] = "claude-haiku-4-5-20251015";
    // Groq models
    ExecutionModel["GROQ_DEEPSEEK_R1_DISTILL_LLAMA_70B"] = "deepseek-r1-distill-llama-70b";
    ExecutionModel["GROQ_DEEPSEEK_R1_DISTILL_LLAMA_70B_SPECDEC"] = "deepseek-r1-distill-llama-70b-specdec";
    ExecutionModel["GROQ_LLAMA_3_3_70B_SPECDEC"] = "llama-3.3-70b-specdec";
    ExecutionModel["GROQ_LLAMA_3_3_70B_VERSATILE"] = "llama-3.3-70b-versatile";
    ExecutionModel["GROQ_LLAMA_4_MAVERICK"] = "meta-llama/llama-4-maverick-17b-128e-instruct";
    ExecutionModel["GROQ_LLAMA_4_SCOUT"] = "meta-llama/llama-4-scout-17b-16e-instruct";
    // Google Gemini 3 models (latest - December 2025)
    ExecutionModel["GEMINI_3_PRO"] = "gemini-3-pro";
    ExecutionModel["GEMINI_3_FLASH"] = "gemini-3-flash";
    // Google Gemini 2.x models (legacy)
    ExecutionModel["GEMINI_2_0_FLASH"] = "gemini-2.0-flash";
    ExecutionModel["GEMINI_2_0_FLASH_LITE"] = "gemini-2.0-flash-lite";
    ExecutionModel["GEMINI_2_5_PRO"] = "gemini-2.5-pro";
    ExecutionModel["GEMINI_2_5_FLASH"] = "gemini-2.5-flash";
})(ExecutionModel || (ExecutionModel = {}));
export const anyOfModels = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};
export const newMLCompletion = async (messages, model, mode = "json") => {
    try {
        // Azure
        if (model === ExecutionModel.AZURE_4_0) {
            return await new4AzureCompletition(messages);
        }
        // OpenAI GPT models (legacy)
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
        // OpenAI GPT-5 models (latest)
        if (model === ExecutionModel.GPT5_2) {
            return await newGPT52Completition(messages, mode);
        }
        if (model === ExecutionModel.GPT5_2_PRO) {
            return await newGPT52ProCompletition(messages, mode);
        }
        // OpenAI reasoning models
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
        // Anthropic Claude 3.x models (legacy)
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
        // Groq models
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
        // Google Gemini 2.x models (legacy)
        if (model === ExecutionModel.GEMINI_2_0_FLASH) {
            return await newGCPCompletion(messages, ExecutionModel.GEMINI_2_0_FLASH, mode);
        }
        if (model === ExecutionModel.GEMINI_2_0_FLASH_LITE) {
            return await newGCPCompletion(messages, ExecutionModel.GEMINI_2_0_FLASH_LITE, mode);
        }
        if (model === ExecutionModel.GEMINI_2_5_PRO) {
            return await newGemini25ProCompletion(messages, mode);
        }
        if (model === ExecutionModel.GEMINI_2_5_FLASH) {
            return await newGemini25FlashCompletion(messages, mode);
        }
    }
    catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
        try {
            return await newGemini3FlashCompletion(messages, mode);
        }
        catch (e) {
            logger.error(`Error in in falling back competion to GCP ${model} with fallback`, e);
        }
        try {
            return await newClaudeCompletion(messages, ExecutionModel.CLAUDE_SONNET_4_5, mode);
        }
        catch (e) {
            logger.error(`Error in in falling back competion to Anthropic  ${model} with fallback`, e);
        }
    }
    return await newGPT52Completition(messages, mode);
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
    return clearFromWrappingTags(reply);
};
export const clearFromWrappingTags = (text) => {
    return text?.replace(/```(json|markdown)?/g, '')?.trim();
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
