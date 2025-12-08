import type { AIProvider } from './types';
import { OpenAIProvider } from './openai-provider';
import { GeminiProvider } from './gemini-provider';
import { AnthropicProvider } from './anthropic-provider';

export function getAIProvider(): AIProvider {
  const provider = import.meta.env.AI_PROVIDER || 'openai';

  switch (provider.toLowerCase()) {
    case 'openai': {
      const apiKey = import.meta.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not set');
      }
      return new OpenAIProvider(apiKey);
    }

    case 'gemini': {
      const apiKey = import.meta.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set');
      }
      return new GeminiProvider(apiKey);
    }

    case 'anthropic': {
      const apiKey = import.meta.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is not set');
      }
      return new AnthropicProvider(apiKey);
    }

    case 'grok': {
      throw new Error('Grok provider not yet implemented');
    }

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
