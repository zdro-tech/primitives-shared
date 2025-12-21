import { AzureOpenAI } from "openai";
import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
export declare const getAzureOpenaiClient: () => AzureOpenAI;
export declare const new4AzureCompletition: (messages: Array<ChatCompletionMessageParam>, mode?: string) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=azure-openai.d.ts.map