import Anthropic from '@anthropic-ai/sdk';
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
export const newClaudeCompletion = async (messages, model) => {
    const systemMessage = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n ");
    const userMessages = messages.filter(m => m.role !== "system");
    console.debug(`Sending Claude request with system ${JSON.stringify(systemMessage)} and other messages ${JSON.stringify(userMessages)}`);
    const message = await getAnthropicClient().messages.create({
        ...defaultClaudeSettings, ...{ model, messages: userMessages, system: systemMessage }
    });
    console.debug(`I've got Claude response ${JSON.stringify(message)}`);
    const stringContent = message.content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('');
    return [{ message: { content: stringContent } }];
};
