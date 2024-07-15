import { OpenAIClient } from "@azure/openai";
import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
import { GetChatCompletionsOptions } from "@azure/openai";
export declare const getAzureOpenaiClient: () => OpenAIClient;
export declare const defaultAzureSettings: GetChatCompletionsOptions;
export declare const new4AzureCompletition: (messages: Array<ChatCompletionMessageParam>) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=azure-openai.d.ts.map