import Groq from "groq-sdk";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources/index";
export declare const getGroqClient: () => Groq;
export declare const defaultGroqSettings: {
    temperature: number;
    max_completion_tokens: number;
};
export declare const newGroqCompletion: (messages: Array<ChatCompletionMessageParam>, model: string, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGroqGptOss120bCompletion: (messages: Array<ChatCompletionMessageParam>, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const newGroqKimiK2Completion: (messages: Array<ChatCompletionMessageParam>, mode?: string) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=groq.d.ts.map