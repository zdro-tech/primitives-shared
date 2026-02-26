import OpenAI from "openai";
import { ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/resources/index";
export declare const getOpenAIClient: () => OpenAI;
export declare const newGCPCompletion: (messages: ChatCompletionMessageParam[], model: string, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGemini31ProCompletion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGemini3ProCompletion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGemini3FlashCompletion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const createChatCompletion: (params: ChatCompletionCreateParamsNonStreaming, mode?: string) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=gcp-ml.d.ts.map