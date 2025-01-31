import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
import { ChatMessage } from "../types/chat-message.js";
import { Message } from "openai/resources/beta/threads/index.mjs";
export declare enum ExecutionModel {
    AZURE_4_0 = "azure",
    GPT3_5_TURBO = "gpt-3.5-turbo",
    GPT4_TURBO = "gpt-4-turbo",
    GPT4_4O = "gpt-4o",
    GPT4_4O_MINI = "gpt-4o-mini",
    O1_MINI = "o1-mini",
    O1 = "o1",
    O3_MINI = "o3-mini",
    CLOUDE_3_OPUS = "claude-3-opus-latest",
    CLOUDE_3_SONNET = "claude-3-5-sonnet-latest",
    CLOUDE_3_HAIKU = "claude-3-5-haiku-latest",
    GROQ_LLAMA_3_70B = "llama-3.3-70b-versatile",
    GROQ_LLAMA_3_8B = "llama-3.1-8b-instant",
    CUSTOM_4_CARE = "4.care.01",
    CUSTOM_4_CARE_DRUGS = "4.care.01-drugs"
}
export declare const anyOfModels: (array: ExecutionModel[]) => ExecutionModel;
export declare const newMLCompletion: (messages: Array<ChatCompletionMessageParam>, model: ExecutionModel, mode?: string) => Promise<ChatCompletion.Choice[]>;
export declare const processRawMessages: (messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel, mode?: string) => Promise<string>;
export declare const processMessages: <T>(messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel, mode?: string) => Promise<T>;
export declare const chatMessagesToCompletionArray: (messages: Array<ChatMessage>, messagesToSend?: Array<ChatCompletionMessageParam>) => ChatCompletionMessageParam[];
export declare const chatMessageWithFilesToText: (message: ChatMessage) => string;
export declare const processChatMessages: <T>(messages: Array<ChatMessage>, instructions: string, language: string, model: ExecutionModel, role?: string) => Promise<T>;
export declare const parseFirstCompletion: (choices: Array<ChatCompletion.Choice>) => any;
export declare const cleanFirstCompletion: (choices: Array<ChatCompletion.Choice>) => string;
export declare const getMessageRole: (message: any) => string;
export declare const addPostInstructions: (messages: Array<ChatCompletionMessageParam>, language: string, role?: string) => ChatCompletionMessageParam[];
export declare const processImage: <T>(base64Image: string, instructions: string, language: string, role?: string) => Promise<T>;
export declare const parseAssistantMessageResponse: (message: Message) => any;
//# sourceMappingURL=ml-basics.d.ts.map