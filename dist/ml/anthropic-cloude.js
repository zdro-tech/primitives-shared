import Anthropic from '@anthropic-ai/sdk';
export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});
export const defaultCloudeSettings = {
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    temperature: 0.3
};
