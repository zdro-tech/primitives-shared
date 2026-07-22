import OpenAI from "openai";
import { ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/resources/index";
export declare const getOpenrouterClient: () => OpenAI;
export declare const defaultOpenrouterSettings: ChatCompletionCreateParamsNonStreaming;
export declare const createOpenrouterChatCompletion: (params: ChatCompletionCreateParamsNonStreaming, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newOpenrouterCompletion: (messages: ChatCompletionMessageParam[], model: string, mode?: string, modelSettings?: Partial<ChatCompletionCreateParamsNonStreaming>) => Promise<ChatCompletion.Choice[]>;
export declare const newOpenrouterGptOss120bCompletion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newOpenrouterGemma431bCompletion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newOpenrouterKimiK26Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newOpenrouterKimiK3Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newOpenrouterGlm52Completion: (messages: ChatCompletionMessageParam[], mode?: string) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=openrouter.d.ts.map