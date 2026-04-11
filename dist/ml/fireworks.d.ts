import OpenAI from "openai";
import { ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/resources/index";
export declare const getFireworksClient: () => OpenAI;
export declare const defaultFireworksSettings: ChatCompletionCreateParamsNonStreaming;
export declare const createFireworksChatCompletion: (params: ChatCompletionCreateParamsNonStreaming, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newFireworksCompletion: (messages: ChatCompletionMessageParam[], model: string, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newFireworksDeepseekV3p1Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newFireworksKimiK25Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newFireworksKimiK2Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newFireworksGlm51Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newFireworksGptOss120bCompletion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newFireworksMiniMaxM25Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=fireworks.d.ts.map