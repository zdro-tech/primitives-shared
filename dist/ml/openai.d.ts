import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs';
import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
export declare const getOpenAIClient: () => OpenAI;
export declare const defaultOpenAISettings: ChatCompletionCreateParamsNonStreaming;
export declare const createChatCompletion: (params: ChatCompletionCreateParamsNonStreaming, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newO3MiniCompletition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newO3MiniHighCompletition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGPT52Completition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGPT52MiniCompletition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGPT52ProCompletition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const visionCompletion: (messages: ChatCompletionMessageParam[]) => Promise<ChatCompletion.Choice[]>;
export declare const createEmbeddings: (input: string | string[], model?: string) => Promise<number[][]>;
//# sourceMappingURL=openai.d.ts.map