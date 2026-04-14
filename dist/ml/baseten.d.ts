import OpenAI from "openai";
import { ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/resources/index";
export declare const getBasetenClient: () => OpenAI;
export declare const defaultBasetenSettings: ChatCompletionCreateParamsNonStreaming;
export declare const createBasetenChatCompletion: (params: ChatCompletionCreateParamsNonStreaming, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newBasetenCompletion: (messages: ChatCompletionMessageParam[], model: string, mode?: string, modelSettings?: Partial<ChatCompletionCreateParamsNonStreaming>) => Promise<ChatCompletion.Choice[]>;
export declare const newBasetenKimiK25Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newBasetenGlm5Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=baseten.d.ts.map