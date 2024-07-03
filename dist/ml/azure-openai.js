import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
export const azureOpenai = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT ?? '', new AzureKeyCredential(process.env.AZURE_OPENAI_CREDENTIALS ?? ''), { apiVersion: '2024-02-15-preview' });
export const defaultAzureSettings = {
    responseFormat: { type: 'json_object' },
    temperature: 0.3,
    n: 1,
    topP: 0.5,
    maxTokens: 1000,
};
