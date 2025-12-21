import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
import { ChatMessage } from "../types/chat-message.js";
import { Message } from "openai/resources/beta/threads/index.mjs";
export declare enum ExecutionModel {
    GPT5_2 = "gpt-5.2",
    GPT5_2_MINI = "gpt-5.2-mini",
    GPT5_2_PRO = "gpt-5.2-pro",
    O3_MINI = "o3-mini",
    O3_MINI_HIGH = "o3-mini-high",
    CLAUDE_OPUS_4_5 = "claude-opus-4-5-20251124",
    CLAUDE_SONNET_4_5 = "claude-sonnet-4-5-20250929",
    CLAUDE_HAIKU_4_5 = "claude-haiku-4-5-20251015",
    GROQ_LLAMA_3_3_70B_VERSATILE = "llama-3.3-70b-versatile",
    GROQ_LLAMA_4_MAVERICK = "meta-llama/llama-4-maverick-17b-128e-instruct",
    GROQ_LLAMA_4_SCOUT = "meta-llama/llama-4-scout-17b-16e-instruct",
    GEMINI_3_PRO = "gemini-3-pro",
    GEMINI_3_FLASH = "gemini-3-flash"
}
export declare const anyOfModels: (array: ExecutionModel[]) => ExecutionModel;
export declare const newMLCompletion: (messages: Array<ChatCompletionMessageParam>, model: ExecutionModel, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const processRawMessages: (messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel, mode?: string) => Promise<string>;
export declare const processMessages: <T>(messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel, mode?: string) => Promise<T>;
export declare const chatMessagesToCompletionArray: (messages: Array<ChatMessage>, messagesToSend?: Array<ChatCompletionMessageParam>) => ChatCompletionMessageParam[];
export declare const chatMessageWithFilesToText: (message: ChatMessage) => string;
export declare const processChatMessages: <T>(messages: Array<ChatMessage>, instructions: string, language: string, model: ExecutionModel, role?: string) => Promise<T>;
export declare const parseFirstCompletion: (choices: Array<ChatCompletion.Choice>) => any;
export declare const getMessageRole: (message: any) => string;
export declare const addPostInstructions: (messages: Array<ChatCompletionMessageParam>, language: string, role?: string) => ChatCompletionMessageParam[];
export declare const processImage: <T>(base64Image: string, instructions: string, language: string, role?: string) => Promise<T>;
export declare const parseAssistantMessageResponse: (message: Message) => any;
//# sourceMappingURL=ml-basics.d.ts.map