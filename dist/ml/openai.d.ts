import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs';
import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
export declare const getOpenAIClient: () => OpenAI;
export declare const defaultOpenAISettings: ChatCompletionCreateParamsNonStreaming;
export declare const createChatCompletion: (params: ChatCompletionCreateParamsNonStreaming, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const new4oMiniCompletition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const new4oCompletition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newO1MiniCompletition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const new4Completition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const new35Completition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newO3MiniCompletition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newO3MiniHighCompletition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newO1Completition: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const visionCompletion: (messages: ChatCompletionMessageParam[]) => Promise<ChatCompletion.Choice[]>;
export declare const createEmbeddings: (input: string | string[], model?: string) => Promise<number[][]>;
//# sourceMappingURL=openai.d.ts.map