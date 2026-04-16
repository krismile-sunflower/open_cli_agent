/**
 * 示例入口文件
 */
import 'dotenv/config';
import { Model } from '@mariozechner/pi-ai';
import { Agent } from '@mariozechner/pi-agent-core';
import { mergeSkills } from './skills/types.js';
import { calculatorSkill } from './skills/calculator.js';
import { timeSkill } from './skills/time.js';
import { helloSkill } from './skills/hello.js';

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
};

const baseSystemPrompt = 'You are a helpful assistant.';
const skills = [timeSkill, calculatorSkill, helloSkill];
const { systemPrompt, tools } = mergeSkills(baseSystemPrompt, skills);

const agent = new Agent({
  initialState: {
    systemPrompt,
    tools,
    model,
  },
  getApiKey: () => process.env.CODEANY_API_KEY,
});

agent.subscribe((event) => {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
  if (event.type === 'tool_execution_start') {
    console.log(`\n[Tool Call] ${event.toolName}(${JSON.stringify(event.args)})`);
  }
  if (event.type === 'tool_execution_update') {
    console.log(`[Tool Update] ${event.toolName}: ${JSON.stringify(event.partialResult)}`);
  }
  if (event.type === 'tool_execution_end') {
    console.log(`[Tool Result] ${event.toolName}: ${JSON.stringify(event.result)}`);
  }
});

console.log('------------------------------------');
await agent.prompt('hello');
console.log();
await agent.prompt('当前时间是多少？然后计算出1+1*3的结果。');
