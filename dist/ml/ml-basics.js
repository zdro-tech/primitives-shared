import { visionCompletion } from "./openai.js";
import { logger } from "../logger/logger.js";
import { MessageAuthor } from "../types/chat-message.js";
import { newOpenrouterDeepseekV41FlashCompletion, newOpenrouterGemma431bCompletion, newOpenrouterGlm52Completion, newOpenrouterGlm53Completion, newOpenrouterGptOss120bCompletion, newOpenrouterKimiK26Completion, newOpenrouterKimiK3Completion } from "./openrouter.js";
export var ExecutionModel;
(function (ExecutionModel) {
    // OpenRouter models — each pinned to its top-3 throughput providers (primary + 2 fallbacks).
    ExecutionModel["OPENROUTER_GPT_OSS_120B"] = "openrouter/openai/gpt-oss-120b";
    ExecutionModel["OPENROUTER_GEMMA_4_31B"] = "openrouter/google/gemma-4-31b-it";
    ExecutionModel["OPENROUTER_KIMI_K2P6"] = "openrouter/moonshotai/kimi-k2.6";
    ExecutionModel["OPENROUTER_KIMI_K3"] = "openrouter/moonshotai/kimi-k3";
    ExecutionModel["OPENROUTER_GLM_5_2"] = "openrouter/z-ai/glm-5.2";
    ExecutionModel["OPENROUTER_GLM_5_3"] = "openrouter/z-ai/glm-5.3";
    ExecutionModel["OPENROUTER_DEEPSEEK_V4P1_FLASH"] = "openrouter/deepseek/deepseek-v4.1-flash";
})(ExecutionModel || (ExecutionModel = {}));
export const anyOfModels = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};
const completions = {
    [ExecutionModel.OPENROUTER_GPT_OSS_120B]: newOpenrouterGptOss120bCompletion,
    [ExecutionModel.OPENROUTER_GEMMA_4_31B]: newOpenrouterGemma431bCompletion,
    [ExecutionModel.OPENROUTER_KIMI_K2P6]: newOpenrouterKimiK26Completion,
    [ExecutionModel.OPENROUTER_KIMI_K3]: newOpenrouterKimiK3Completion,
    [ExecutionModel.OPENROUTER_GLM_5_2]: newOpenrouterGlm52Completion,
    [ExecutionModel.OPENROUTER_GLM_5_3]: newOpenrouterGlm53Completion,
    [ExecutionModel.OPENROUTER_DEEPSEEK_V4P1_FLASH]: newOpenrouterDeepseekV41FlashCompletion,
};
// Tried in order after the requested model. Three different model families on different
// hosts, so a single deprecation or provider outage cannot take out the whole chain.
const FALLBACK_MODELS = [
    ExecutionModel.OPENROUTER_GLM_5_3,
    ExecutionModel.OPENROUTER_DEEPSEEK_V4P1_FLASH,
    ExecutionModel.OPENROUTER_GPT_OSS_120B,
];
// A reply the caller cannot parse counts as a failure of that model, so the next one gets a turn.
const assertUsableCompletion = (choices, mode) => {
    const content = choices?.[0]?.message?.content;
    if (!content?.trim()) {
        throw new Error("Empty completion");
    }
    if (mode === "json") {
        parseJsonContent(content);
    }
};
export const newMLCompletion = async (messages, model, mode = "json") => {
    const chain = [model, ...FALLBACK_MODELS.filter(fallback => fallback !== model)];
    let lastError;
    for (const candidate of chain) {
        try {
            const choices = await completions[candidate](messages, mode);
            assertUsableCompletion(choices, mode);
            return choices;
        }
        catch (e) {
            lastError = e;
            logger.error(`Error in newMLCompletion ${candidate}`, e);
        }
    }
    throw lastError;
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
// Models occasionally wrap the JSON in prose ("Sure, here it is: {...}"), so when the whole
// reply does not parse, take the first embedded object or array that does.
const embeddedJson = (text) => {
    for (let start = 0; start < text.length; start++) {
        const closer = text[start] === "{" ? "}" : text[start] === "[" ? "]" : undefined;
        if (!closer) {
            continue;
        }
        for (let end = text.lastIndexOf(closer); end > start; end = text.lastIndexOf(closer, end - 1)) {
            try {
                return JSON.parse(text.slice(start, end + 1));
            }
            catch {
                // keep shrinking
            }
        }
    }
    return undefined;
};
const parseJsonContent = (content) => {
    const stringifiedJson = removeTerminalMarkers(extractFromMarkdown(content));
    try {
        return JSON.parse(stringifiedJson);
    }
    catch (e) {
        const embedded = embeddedJson(stringifiedJson);
        if (embedded === undefined) {
            throw e;
        }
        return embedded;
    }
};
export const parseFirstCompletion = (choices) => {
    const content = choices[0]?.message?.content ?? "{}";
    try {
        return parseJsonContent(content);
    }
    catch (e) {
        logger.error(`JSON parse crash: ${content} and choices were`, choices);
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
