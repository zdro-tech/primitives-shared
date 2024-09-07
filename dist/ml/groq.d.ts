import Groq from "groq-sdk";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources/index";
export declare const getGroqClient: () => Groq;
export declare const newGroqCompletion: (messages: Array<ChatCompletionMessageParam>, model: string) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=groq.d.ts.map