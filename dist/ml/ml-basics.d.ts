import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
import { ChatMessage } from "../types/chat-message.js";
import { Message } from "openai/resources/beta/threads/index.mjs";
export declare enum ExecutionModel {
    AZURE_4_0 = "azure",
    GPT3_5_TURBO = "gpt-3.5-turbo",
    GPT4_TURBO = "gpt-4-turbo",
    GPT4_4O = "gpt-4o",
    GPT4_4O_MINI = "gpt-4o-mini",
    GPT5_2 = "gpt-5.2",
    GPT5_2_PRO = "gpt-5.2-pro",
    O1_MINI = "o1-mini",
    O1 = "o1",
    O3_MINI = "o3-mini",
    O3_MINI_HIGH = "o3-mini-high",
    CLAUDE_3_OPUS = "claude-3-opus-latest",
    CLAUDE_3_5_SONNET = "claude-3-5-sonnet-latest",
    CLAUDE_3_7_SONNET = "claude-3-7-sonnet-latest",
    CLAUDE_3_5_HAIKU = "claude-3-5-haiku-latest",
    CLAUDE_OPUS_4_5 = "claude-opus-4-5-20251124",
    CLAUDE_SONNET_4_5 = "claude-sonnet-4-5-20250929",
    CLAUDE_HAIKU_4_5 = "claude-haiku-4-5-20251015",
    GROQ_DEEPSEEK_R1_DISTILL_LLAMA_70B = "deepseek-r1-distill-llama-70b",
    GROQ_DEEPSEEK_R1_DISTILL_LLAMA_70B_SPECDEC = "deepseek-r1-distill-llama-70b-specdec",
    GROQ_LLAMA_3_3_70B_SPECDEC = "llama-3.3-70b-specdec",
    GROQ_LLAMA_3_3_70B_VERSATILE = "llama-3.3-70b-versatile",
    GROQ_LLAMA_4_MAVERICK = "meta-llama/llama-4-maverick-17b-128e-instruct",
    GROQ_LLAMA_4_SCOUT = "meta-llama/llama-4-scout-17b-16e-instruct",
    GEMINI_3_PRO = "gemini-3-pro",
    GEMINI_3_FLASH = "gemini-3-flash",
    GEMINI_2_0_FLASH = "gemini-2.0-flash",
    GEMINI_2_0_FLASH_LITE = "gemini-2.0-flash-lite",
    GEMINI_2_5_PRO = "gemini-2.5-pro",
    GEMINI_2_5_FLASH = "gemini-2.5-flash"
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
export declare const clearFromWrappingTags: (text: string) => string;
export declare const getMessageRole: (message: any) => string;
export declare const addPostInstructions: (messages: Array<ChatCompletionMessageParam>, language: string, role?: string) => ChatCompletionMessageParam[];
export declare const processImage: <T>(base64Image: string, instructions: string, language: string, role?: string) => Promise<T>;
export declare const parseAssistantMessageResponse: (message: Message) => any;
//# sourceMappingURL=ml-basics.d.ts.map