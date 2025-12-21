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
            apiKey: process.env.ANTHROPIC_API_KEY
        });
    }
    return anthropic;
}

export const defaultClaudeSettings = {
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    temperature: 0.3
}

// Extract content from markdown code blocks (with or without language specifier)
const extractFromMarkdown = (text: string): string => {
    const match = text.match(/```(?:json|markdown)?\s*([\s\S]*?)\s*```/);
    return match && match[1] ? match[1].trim() : text;
};

export const newClaudeCompletion = async (messages: Array<ChatCompletionMessageParam>, model: string, mode?: string): Promise<ChatCompletion.Choice[]> => {
    const systemMessage = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n ")
    const userMessages = messages.filter(m => m.role !== "system") as Array<MessageParam>
    const message = await getAnthropicClient().messages.create({
        ...defaultClaudeSettings, ...{ model, messages: userMessages, system: systemMessage }
    } as MessageCreateParamsNonStreaming);
    let stringContent = message.content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('');
    if (mode === 'json') {
        stringContent = extractFromMarkdown(stringContent);
    }
    return [{ message: { content: stringContent } as ChatCompletionMessage }] as ChatCompletion.Choice[]
}