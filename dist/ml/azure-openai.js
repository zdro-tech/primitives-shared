import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
let azureOpenai;
export const getAzureOpenaiClient = () => {
    if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_CREDENTIALS) {
        throw new Error('AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_CREDENTIALS are not set');
    }
    if (!azureOpenai) {
        azureOpenai = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT ?? '', new AzureKeyCredential(process.env.AZURE_OPENAI_CREDENTIALS ?? ''), { apiVersion: '2024-02-15-preview' });
    }
    return azureOpenai;
};
export const defaultAzureSettings = {
    responseFormat: { type: 'json_object' },
    temperature: 0.3,
    n: 1,
    topP: 0.5,
    maxTokens: 1000,
};
export const new4AzureCompletition = async (messages) => {
    const { choices } = await getAzureOpenaiClient().getChatCompletions("aloe-chat", messages, {
        ...defaultAzureSettings
    });
    return choices;
};
