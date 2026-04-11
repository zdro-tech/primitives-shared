import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
import { ChatMessage } from "../types/chat-message.js";
import { Message } from "openai/resources/beta/threads/index.mjs";
export declare enum ExecutionModel {
    GPT5_4 = "gpt-5.4",
    GPT5_4_MINI = "gpt-5.4-mini",
    GPT5_4_NANO = "gpt-5.4-nano",
    CLAUDE_OPUS_4_6 = "claude-opus-4-6",
    CLAUDE_SONNET_4_6 = "claude-sonnet-4-6",
    GROQ_GPT_OSS_120B = "openai/gpt-oss-120b",
    FIREWORKS_DEEPSEEK_V3P1 = "accounts/fireworks/models/deepseek-v3p1",
    FIREWORKS_KIMI_K2P5 = "accounts/fireworks/models/kimi-k2p5",
    FIREWORKS_GLM_5P1 = "accounts/fireworks/models/glm-5p1",
    FIREWORKS_GPT_OSS_120B = "accounts/fireworks/models/gpt-oss-120b",
    FIREWORKS_MINIMAX_M2P5 = "accounts/fireworks/models/minimax-m2p5",
    TOGETHER_KIMI_K2P5 = "moonshotai/Kimi-K2.5",
    TOGETHER_GLM_5P1 = "zai-org/GLM-5.1",
    TOGETHER_MINIMAX_M2P5 = "MiniMaxAI/MiniMax-M2.5",
    TOGETHER_GPT_OSS_120B = "together/openai/gpt-oss-120b",
    GEMINI_3_1_PRO = "gemini-3.1-pro-preview",
    GEMINI_3_PRO = "gemini-3-pro-preview",
    GEMINI_3_FLASH = "gemini-3-flash-preview"
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