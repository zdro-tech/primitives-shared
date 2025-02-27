import OpenAI from "openai";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources/index";
export declare const getOpenAIClient: () => OpenAI;
export declare const newGCPCompletion: (messages: ChatCompletionMessageParam[], model: string, mode?: string) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=gcp-ml.d.ts.map