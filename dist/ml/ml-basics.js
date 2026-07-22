import { visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";
import { MessageAuthor } from "../types/chat-message.js";
import { newOpenrouterGemma431bCompletion, newOpenrouterGptOss120bCompletion, newOpenrouterKimiK26Completion } from "./openrouter.js";
export var ExecutionModel;
(function (ExecutionModel) {
    // OpenRouter models — each pinned to its top-3 throughput providers (primary + 2 fallbacks).
    ExecutionModel["OPENROUTER_GPT_OSS_120B"] = "openrouter/openai/gpt-oss-120b";
    ExecutionModel["OPENROUTER_GEMMA_4_31B"] = "openrouter/google/gemma-4-31b-it";
    ExecutionModel["OPENROUTER_KIMI_K2P6"] = "openrouter/moonshotai/kimi-k2.6";
})(ExecutionModel || (ExecutionModel = {}));
export const anyOfModels = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};
export const newMLCompletion = async (messages, model, mode = "json") => {
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
    }
    catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
    }
    // Final fallback: GPT-OSS-120B (Cerebras primary + Bedrock/Groq fallbacks).
    return await newOpenrouterGptOss120bCompletion(messages, mode);
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
// Extract content from markdown code blocks (with or without language specifier)
const extractFromMarkdown = (text) => {
    const match = text.match(/```(?:json|markdown)?\s*([\s\S]*?)\s*```/);
    return match && match[1] ? match[1].trim() : text;
};
const removeTerminalMarkers = (text) => {
    return text.replace(/\s*\[EOS\]\s*$/i, "").trim();
};
export const parseFirstCompletion = (choices) => {
    const stringifiedJson = removeTerminalMarkers(extractFromMarkdown(choices[0]?.message?.content ?? "{}"));
    try {
        return JSON.parse(stringifiedJson);
    }
    catch (e) {
        logger.error(`JSON parse crash: ${stringifiedJson} and choices were`, choices);
        throw e;
    }
};
const cleanFirstCompletion = (choices) => {
    return removeTerminalMarkers(extractFromMarkdown(choices[0]?.message?.content ?? ""));
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
    return parseFirstCompletion(await visionCompletion(addPostInstructions(messagesToSend, language, role)));
};
export const parseAssistantMessageResponse = (message) => {
    const content = message?.content[0];
    return JSON.parse(content?.text?.value);
};
