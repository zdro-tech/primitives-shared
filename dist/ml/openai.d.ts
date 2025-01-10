import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs';
import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
export declare const getOpenAIClient: () => OpenAI;
export declare const defaultOpenAISettings: ChatCompletionCreateParamsNonStreaming;
export declare const new4oMiniCompletition: (messages: Array<ChatCompletionMessageParam>) => Promise<ChatCompletion.Choice[]>;
export declare const new4oCompletition: (messages: Array<ChatCompletionMessageParam>) => Promise<ChatCompletion.Choice[]>;
export declare const newO1MiniCompletition: (messages: Array<ChatCompletionMessageParam>) => Promise<ChatCompletion.Choice[]>;
export declare const newO1Completition: (messages: Array<ChatCompletionMessageParam>) => Promise<ChatCompletion.Choice[]>;
export declare const new4Completition: (messages: Array<ChatCompletionMessageParam>) => Promise<ChatCompletion.Choice[]>;
export declare const new35Completition: (messages: Array<ChatCompletionMessageParam>) => Promise<ChatCompletion.Choice[]>;
export declare const visionCompletion: (messages: Array<ChatCompletionMessageParam>) => Promise<ChatCompletion.Choice[]>;
export declare const createEmbeddings: (input: string | string[], model?: string) => Promise<number[][]>;
//# sourceMappingURL=openai.d.ts.map