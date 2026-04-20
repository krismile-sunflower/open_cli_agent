import 'dotenv/config';
import type { Model } from '@mariozechner/pi-ai';
import { AuthStorage } from '@mariozechner/pi-coding-agent';

export const CLI_NAME = 'oca';
export const CLI_VERSION = '0.1.0';

export const MODEL: Model<'anthropic-messages'> = {
  id: 'glm-4.5-air',
  name: 'GLM-4.5-air',
  api: 'anthropic-messages',
  provider: 'zhipu',
  baseUrl: 'https://open.bigmodel.cn/api/anthropic',
  reasoning: true,
  input: ['text'],
  cost: { input: 0.2, output: 1.1, cacheRead: 0.03, cacheWrite: 0 },
  contextWindow: 131072,
  maxTokens: 98304,
};

export function createAuth(): AuthStorage {
  return AuthStorage.inMemory({
    zhipu: {
      key: process.env.ZHIPU_API_KEY ?? '',
      type: 'api_key',
    },
  });
}
