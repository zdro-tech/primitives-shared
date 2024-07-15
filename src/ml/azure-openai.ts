import { AzureKeyCredential, ChatCompletionsResponseFormat, OpenAIClient } from "@azure/openai";
import { ChatCompletionMessageParam, ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessage, } from "openai/resources/index"
import { ChatRequestMessage, GetChatCompletionsOptions } from "@azure/openai";
let azureOpenai: OpenAIClient;
export const getAzureOpenaiClient = () => {
    if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_CREDENTIALS) {
        throw new Error('AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_CREDENTIALS are not set');
    }
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

export const new4AzureCompletition = async (messages: Array<ChatCompletionMessageParam>): Promise<ChatCompletion.Choice[]> => {
    const { choices } = await getAzureOpenaiClient().getChatCompletions(
        "aloe-chat", messages as ChatRequestMessage[],
        {
            ...defaultAzureSettings as GetChatCompletionsOptions
        });
    return choices as unknown as ChatCompletion.Choice[]
}