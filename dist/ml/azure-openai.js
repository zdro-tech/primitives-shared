import { AzureOpenAI } from "openai";
import { defaultOpenAISettings } from "./openai.js";
let azureOpenai;
export const getAzureOpenaiClient = () => {
    if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_CREDENTIALS) {
        throw new Error('AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_CREDENTIALS are not set');
    }
    if (!azureOpenai) {
        azureOpenai = new AzureOpenAI({
            baseURL: process.env.AZURE_OPENAI_ENDPOINT,
            apiKey: process.env.AZURE_OPENAI_CREDENTIALS,
            apiVersion: process.env.OPENAI_API_VERSION ?? '2024-04-01-preview',
            dangerouslyAllowBrowser: false
        });
    }
    return azureOpenai;
};
export const new4AzureCompletition = async (messages) => {
    const client = getAzureOpenaiClient();
    const result = await client.chat.completions.create({
        ...defaultOpenAISettings,
        messages,
        model: "aloe-chat",
    }, { maxRetries: 1 });
    return result.choices;
};
