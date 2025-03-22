import Anthropic from '@anthropic-ai/sdk';
import { clearFromWrappingTags } from './ml-basics.js';
let anthropic;
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
};
export const defaultClaudeSettings = {
    model: "claude-3-opus-latest",
    max_tokens: 3072,
    temperature: 0.3
};
export const newClaudeCompletion = async (messages, model, mode) => {
    const systemMessage = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n ");
    const userMessages = messages.filter(m => m.role !== "system");
    const message = await getAnthropicClient().messages.create({
        ...defaultClaudeSettings, ...{ model, messages: userMessages, system: systemMessage }
    });
    let stringContent = message.content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('');
    if (mode === 'json') {
        stringContent = clearFromWrappingTags(stringContent);
    }
    return [{ message: { content: stringContent } }];
};
