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
    model: "claude-3-opus-latest",
    max_tokens: 2048,
    temperature: 0.3
}

export const newClaudeCompletion = async (messages: Array<ChatCompletionMessageParam>, model: string): Promise<ChatCompletion.Choice[]> => {
    const systemMessage = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n ")
    const userMessages = messages.filter(m => m.role !== "system") as Array<MessageParam>
    console.debug(`Sending Claude request with system ${JSON.stringify(systemMessage)} and other messages ${JSON.stringify(userMessages)}`)
    const message = await getAnthropicClient().messages.create({
        ...defaultClaudeSettings, ...{ model, messages: userMessages, system: systemMessage }
    } as MessageCreateParamsNonStreaming);
    console.debug(`I've got Claude response ${JSON.stringify(message)}`)
    const stringContent = message.content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('');
    return [{ message: { content: stringContent } as ChatCompletionMessage }] as ChatCompletion.Choice[]
}