import OpenAI from "openai";
import { ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/resources/index";
export declare const getTogetherClient: () => OpenAI;
export declare const defaultTogetherSettings: ChatCompletionCreateParamsNonStreaming;
export declare const createTogetherChatCompletion: (params: ChatCompletionCreateParamsNonStreaming, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newTogetherCompletion: (messages: ChatCompletionMessageParam[], model: string, mode?: string, modelSettings?: Partial<ChatCompletionCreateParamsNonStreaming>) => Promise<ChatCompletion.Choice[]>;
export declare const newTogetherKimiK25Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newTogetherGlm51Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newTogetherMiniMaxM25Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newTogetherGptOss120bCompletion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=together.d.ts.map