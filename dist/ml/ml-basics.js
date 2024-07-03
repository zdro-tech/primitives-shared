import { backOff } from "exponential-backoff";
import { defaultOpenAISettings, openAIClient } from "./openai.js";
import { logger } from "../logger/logger.js";
import { azureOpenai, defaultAzureSettings } from "./azure-openai.js";
import { MessageAuthor } from "../types/chat-message.js";
import { anthropic, defaultCloudeSettings } from "./anthropic-cloude.js";
const retryOptions = {
    retry: (error, attemptNumber) => {
        logger.debug("Retrying openai request, attempt: " + attemptNumber + " error: ", error);
        return error.message.includes('timed out');
    },
    numOfAttempts: 2
};
export var ExecutionModel;
(function (ExecutionModel) {
    ExecutionModel["AZURE_4_0"] = "azure";
    ExecutionModel["GPT3_5_TURBO"] = "gpt-3.5-turbo";
    ExecutionModel["GPT4_TURBO"] = "gpt-4-turbo";
    ExecutionModel["GPT4_4O"] = "gpt-4o";
    ExecutionModel["CLOUDE_3_OPUS"] = "claude-3-opus-20240229";
    ExecutionModel["CLOUDE_3_SONNET"] = "claude-3-sonnet-20240229";
    ExecutionModel["CLOUDE_3_HAIKU"] = "claude-3-haiku-20240307";
})(ExecutionModel || (ExecutionModel = {}));
export const anyOfModels = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};
export const newMLCompletion = async (messages, model) => {
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
    }
    catch (e) {
        logger.error(`Error in newMLCompletion ${model}`, e);
    }
    return await new4Completition(messages);
};
export const newCloudeCompletion = async (messages, model) => {
    const systemMessage = messages.filter(m => m.role === "system").map(m => m.content).join(". ") + " Return only valid JSON and nothng else.";
    const cloudeMessages = messages.filter(m => m.role !== "system");
    cloudeMessages.push({
        "role": "assistant",
        "content": "{"
    });
    const message = await anthropic.messages.create({
        ...defaultCloudeSettings, ...{ model, messages: cloudeMessages, system: systemMessage }
    });
    return [{ message: { content: message.content[0].text } }];
};
export const new4AzureCompletition = async (messages) => {
    const { choices } = await azureOpenai.getChatCompletions("aloe-chat", messages, {
        ...defaultAzureSettings
    });
    return choices;
};
const new35Completition = async (messages) => {
    return await backOff(async () => {
        const reply = await openAIClient.chat.completions.create({
            ...defaultOpenAISettings,
            model: "gpt-3.5-turbo-0125",
            max_tokens: 1000,
            messages: messages
        });
        return reply?.choices;
    }, retryOptions);
};
const new4oCompletition = async (messages) => {
    return await backOff(async () => {
        const reply = await openAIClient.chat.completions.create({
            ...defaultOpenAISettings,
            model: "gpt-4o",
            messages: messages
        });
        return reply?.choices;
    }, retryOptions);
};
const new4Completition = async (messages) => {
    return await backOff(async () => {
        const reply = await openAIClient.chat.completions.create({
            ...defaultOpenAISettings,
            model: "gpt-4-turbo",
            messages: messages
        });
        return reply?.choices;
    }, retryOptions);
};
export const processMessages = async (messages, language, model) => {
    return parseFirstCompletion(await newMLCompletion(addPostInstructions(messages, language), model));
};
export const processChatMessages = async (messages, instructions, language, model) => {
    const messagesToSend = [{ "role": "system", "content": instructions }];
    messages.forEach(m => {
        messagesToSend.push({ "role": getMessageRole(m), "content": m.text });
    });
    return parseFirstCompletion(await newMLCompletion(addPostInstructions(messagesToSend, language), model));
};
export const processChatMessage = async (message, instructions, language, model) => {
    const messagesToSend = [{ "role": "system", "content": instructions }];
    messagesToSend.push({ "role": getMessageRole(message), "content": message.text });
    return parseFirstCompletion(await newMLCompletion(addPostInstructions(messagesToSend, language), model));
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
export const getMessageRole = (message) => {
    return message.author == MessageAuthor.Bot ? "assistant" : "user";
};
export const addPostInstructions = (messages, language) => {
    messages.push({ "role": "system", "content": `Use and reply strictly in ${language} language.` });
    return messages;
};
export const visionCompletion = async (messages) => {
    return await backOff(async () => {
        const reply = await openAIClient.chat.completions.create({
            model: "gpt-4-vision-preview",
            max_tokens: 1000,
            messages: messages
        });
        return reply?.choices;
    }, retryOptions);
};
export const processImage = async (base64Image, instructions, language) => {
    const messagesToSend = [{ "role": "system", "content": instructions }];
    messagesToSend.push({
        role: "user",
        content: [{
                type: "image_url",
                image_url: { url: base64Image }
            }]
    });
    return parseFirstCompletionWithPossibleMarkdown(await visionCompletion(addPostInstructions(messagesToSend, language)));
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
