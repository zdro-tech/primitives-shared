import Anthropic from '@anthropic-ai/sdk';

let anthropic: Anthropic;
export const getAnthropicClient = () => {
    if (!anthropic) {
        anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });
    }
    return anthropic;
}

export const defaultCloudeSettings = {
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    temperature: 0.3
}

