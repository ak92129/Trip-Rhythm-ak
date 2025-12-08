import type { AIProvider } from './types';
import { OpenAIProvider } from './openai-provider';
import { GeminiProvider } from './gemini-provider';
import { AnthropicProvider } from './anthropic-provider';

export function getAIProvider(): AIProvider {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'openai';

  switch (provider.toLowerCase()) {
    case 'openai': {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_OPENAI_API_KEY is not set');
      }
      return new OpenAIProvider(apiKey);
    }

    case 'gemini': {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_GEMINI_API_KEY is not set');
      }
      return new GeminiProvider(apiKey);
    }

    case 'anthropic': {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_ANTHROPIC_API_KEY is not set');
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
