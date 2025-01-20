import Anthropic from '@anthropic-ai/sdk';
import { ChatCompletionMessageParam, ChatCompletion, ChatCompletionCreateParamsNonStreaming, ChatCompletionMessage, } from "openai/resources/index"
import { MessageCreateParamsNonStreaming, MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";

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

export const defaultCloudeSettings = {
    model: "claude-3-opus-latest",
    max_tokens: 2048,
    temperature: 0.3
}

export const newCloudeCompletion = async (messages: Array<ChatCompletionMessageParam>, model: string): Promise<ChatCompletion.Choice[]> => {
    const systemMessage = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n ")
    const cloudeMessages = messages.filter(m => m.role !== "system") as Array<MessageParam>
    const message = await getAnthropicClient().messages.create({
        ...defaultCloudeSettings, ...{ model, messages: cloudeMessages, system: systemMessage }
    } as MessageCreateParamsNonStreaming);
    console.debug(`I've got Cloude response ${JSON.stringify(message)}`)
    const stringContent = message.content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('');
    return [{ message: { content: stringContent } as ChatCompletionMessage }] as ChatCompletion.Choice[]
}