import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
import { ChatMessage } from "../types/chat-message.js";
import { Message } from "openai/resources/beta/threads/index.mjs";
export declare enum ExecutionModel {
    AZURE_4_0 = "azure",
    GPT3_5_TURBO = "gpt-3.5-turbo",
    GPT4_TURBO = "gpt-4-turbo",
    GPT4_4O = "gpt-4o",
    CLOUDE_3_OPUS = "claude-3-opus-20240229",
    CLOUDE_3_SONNET = "claude-3-sonnet-20240229",
    CLOUDE_3_HAIKU = "claude-3-haiku-20240307"
}
export declare const anyOfModels: (array: ExecutionModel[]) => ExecutionModel;
export declare const newMLCompletion: (messages: Array<ChatCompletionMessageParam>, model: ExecutionModel) => Promise<ChatCompletion.Choice[]>;
export declare const newCloudeCompletion: (messages: Array<ChatCompletionMessageParam>, model: string) => Promise<ChatCompletion.Choice[]>;
export declare const new4AzureCompletition: (messages: Array<ChatCompletionMessageParam>) => Promise<ChatCompletion.Choice[]>;
export declare const processMessages: <T>(messages: Array<ChatCompletionMessageParam>, language: string, model: ExecutionModel) => Promise<T>;
export declare const processChatMessages: <T>(messages: Array<ChatMessage>, instructions: string, language: string, model: ExecutionModel) => Promise<T>;
export declare const processChatMessage: <T>(message: ChatMessage, instructions: string, language: string, model: ExecutionModel) => Promise<T>;
export declare const parseFirstCompletion: (choices: Array<ChatCompletion.Choice>) => any;
export declare const getMessageRole: (message: any) => string;
export declare const addPostInstructions: (messages: Array<ChatCompletionMessageParam>, language: string) => ChatCompletionMessageParam[];
export declare const visionCompletion: (messages: Array<ChatCompletionMessageParam>) => Promise<ChatCompletion.Choice[]>;
export declare const processImage: <T>(base64Image: string, instructions: string, language: string) => Promise<T>;
export declare const parseAssistantMessageResponse: (message: Message) => any;
//# sourceMappingURL=ml-basics.d.ts.map