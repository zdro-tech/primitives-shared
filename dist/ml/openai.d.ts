import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs';
import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
export declare const getOpenAIClient: () => OpenAI;
export declare const defaultOpenAISettings: ChatCompletionCreateParamsNonStreaming;
export declare const createChatCompletion: (params: ChatCompletionCreateParamsNonStreaming, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGPT54Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGPT54MiniCompletion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGPT54NanoCompletion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const visionCompletion: (messages: ChatCompletionMessageParam[]) => Promise<ChatCompletion.Choice[]>;
export declare const createEmbeddings: (input: string | string[], model?: string) => Promise<number[][]>;
//# sourceMappingURL=openai.d.ts.map