import Anthropic from '@anthropic-ai/sdk';
import { ChatCompletionMessageParam, ChatCompletion } from "openai/resources/index";
export declare const getAnthropicClient: () => Anthropic;
export declare const defaultClaudeSettings: {
    model: string;
    max_tokens: number;
    temperature: number;
};
export declare const newClaudeCompletion: (messages: Array<ChatCompletionMessageParam>, model: string) => Promise<ChatCompletion.Choice[]>;
//# sourceMappingURL=anthropic-cloude.d.ts.map