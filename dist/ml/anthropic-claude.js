import Anthropic from '@anthropic-ai/sdk';
let anthropic;
export const getAnthropicClient = () => {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not set');
    }
    if (!anthropic) {
        anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }
    return anthropic;
};
export const defaultClaudeSettings = {
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    temperature: 0.3
};
export const newClaudeCompletion = async (messages, model, mode, jsonSchema) => {
    const systemMessage = messages
        .filter(m => m.role === "system" || m.role === "developer")
        .map(m => m.content)
        .join("\n\n ");
    const userMessages = messages
        .filter(m => m.role === "user" || m.role === "assistant");
    const params = {
        ...defaultClaudeSettings,
        model,
        messages: userMessages,
    };
    if (systemMessage) {
        params.system = systemMessage;
    }
    if (mode === 'json' && jsonSchema) {
        params.output_config = {
            format: {
                type: 'json_schema',
                schema: jsonSchema
            }
        };
    }
    const message = await getAnthropicClient().messages.create(params);
    if (message.stop_reason === 'max_tokens' || message.stop_reason === 'refusal') {
        throw new Error(`Claude response stopped before producing valid output: ${message.stop_reason}`);
    }
    const stringContent = message.content
        .filter((block) => block.type === 'text')
        .map(block => block.text)
        .join('');
    return [{ message: { content: stringContent } }];
};
