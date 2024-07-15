import Groq from "groq-sdk";
import { ChatCompletionMessageParam as OpenAIChatCompletionMessageParam } from "openai/resources/index";
export declare const getGroqClient: () => Groq;
export declare const newGroqCompletion: (messages: Array<OpenAIChatCompletionMessageParam>, model: string) => Promise<Groq.Chat.Completions.ChatCompletion.Choice[]>;
//# sourceMappingURL=groq.d.ts.map