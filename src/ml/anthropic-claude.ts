import Anthropic from '@anthropic-ai/sdk';
import { MessageParam, MessageCreateParamsNonStreaming } from '@anthropic-ai/sdk/resources/index.mjs';
import { ChatCompletionMessageParam, ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessage, } from "openai/resources/index"

let anthropic: Anthropic;
export const getAnthropicClient = () => {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not set');
    }

    if (!anthropic) {
        anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
            defaultHeaders: {
                'anthropic-beta': 'structured-outputs-2025-11-13'
            }
        });
    }
    return anthropic;
}

export const defaultClaudeSettings = {
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    temperature: 0.3
};

export const newClaudeCompletion = async (messages: Array<ChatCompletionMessageParam>, model: string, mode?: string): Promise<ChatCompletion.Choice[]> => {
    const systemMessage = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n ")
    const userMessages = messages.filter(m => m.role !== "system") as Array<MessageParam>

    const params: any = {
        ...defaultClaudeSettings,
        model,
        messages: userMessages,
    };
    if (systemMessage) {
        params.system = systemMessage;
    }

    if (mode === 'json') {
        params.output_format = {
            type: 'json_schema',
            schema: {
                type: 'object',
                additionalProperties: false
            }
        };
    }

    const message = await getAnthropicClient().messages.create(params as MessageCreateParamsNonStreaming);
    const stringContent = message.content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('');

    return [{ message: { content: stringContent } as ChatCompletionMessage }] as ChatCompletion.Choice[]
}
