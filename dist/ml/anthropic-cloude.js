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
export const defaultCloudeSettings = {
    model: "claude-3-opus-latest",
    max_tokens: 2048,
    temperature: 0.3
};
export const newCloudeCompletion = async (messages, model) => {
    const systemMessage = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n ");
    const cloudeMessages = messages.filter(m => m.role !== "system");
    const message = await getAnthropicClient().messages.create({
        ...defaultCloudeSettings, ...{ model, messages: cloudeMessages, system: systemMessage }
    });
    console.debug(`I've got Cloude response ${JSON.stringify(message)}`);
    const stringContent = message.content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('');
    return [{ message: { content: stringContent } }];
};
