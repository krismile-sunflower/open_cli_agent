/**
 * 示例入口文件
 */
import 'dotenv/config';
import { Context, Model, stream } from '@mariozechner/pi-ai';

const model: Model<'anthropic-messages'> = {
  id: 'glm-4.5-air',
  name: 'GLM',
  api: 'anthropic-messages',
  provider: 'zhipu',
  baseUrl: 'https://open.bigmodel.cn/api/anthropic',
  reasoning: true,
  input: ['text',],
  cost: { input: 0.2, output: 1.1, cacheRead: 0.03, cacheWrite: 0 },
  contextWindow: 131072,
  maxTokens: 98304
//   headers: {
//     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
//     'X-Custom-Auth': `Bearer ${process.env.CODEANY_API_KEY}`
//   }
};


const context: Context = {
  systemPrompt: 'You are a helpful assistant.',
  messages: [
    { role: 'user', content: '写一首关于皮皮丸的诗?', timestamp: Date.now() }
  ]
};
// console.log(process.env.CODEANY_API_KEY);
const s = stream(model, context, {
    apiKey: process.env.CODEANY_API_KEY
});

for await (const chunk of s) {
    if (chunk.type === 'text_delta') {
        // console.log(chunk.delta);
         process.stdout.write(chunk.delta);
    }
//   process.stdout.write(chunk.type);
}
