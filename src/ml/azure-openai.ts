import { AzureKeyCredential, ChatCompletionsResponseFormat, GetChatCompletionsOptions, OpenAIClient } from "@azure/openai";

let azureOpenai: OpenAIClient;
export const getAzureOpenaiClient = () => {
    if (!azureOpenai) {
        azureOpenai = new OpenAIClient(
            process.env.AZURE_OPENAI_ENDPOINT ?? '',
            new AzureKeyCredential(process.env.AZURE_OPENAI_CREDENTIALS ?? ''),
            { apiVersion: '2024-02-15-preview' }
        );
    }
    return azureOpenai;
}

export const defaultAzureSettings = {
    responseFormat: { type: 'json_object' } as ChatCompletionsResponseFormat,
    temperature: 0.3,
    n: 1,
    topP: 0.5,
    maxTokens: 1000,
} as GetChatCompletionsOptions