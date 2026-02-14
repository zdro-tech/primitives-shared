import Anthropic from '@anthropic-ai/sdk';
let anthropic;
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
};
export const defaultClaudeSettings = {
    model: "claude-sonnet-4-5",
    max_tokens: 8192,
    temperature: 0.3
};
export const newClaudeCompletion = async (messages, model, mode) => {
    const systemMessage = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n ");
    const userMessages = messages.filter(m => m.role !== "system");
    const params = {
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
    const message = await getAnthropicClient().messages.create(params);
    const stringContent = message.content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('');
    return [{ message: { content: stringContent } }];
};
