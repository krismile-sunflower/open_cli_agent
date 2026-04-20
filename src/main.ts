/**
 * Minimal SDK Usage
 *
 * Uses all defaults: discovers skills, extensions, tools, context files
 * from cwd and ~/.pi/agent. Model chosen from settings or first available.
 */
import 'dotenv/config';
import { Model } from "@mariozechner/pi-ai";
import { AuthStorage, createAgentSession } from "@mariozechner/pi-coding-agent";

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
  maxTokens: 98304,
  
};

const auth: AuthStorage = AuthStorage.inMemory({
  'zhipu': {
    key: process.env.ZHIPU_API_KEY || '',
    type: 'api_key',
  },
});



const { session } = await createAgentSession({
  model: model,
  authStorage: auth
});

const loadedSkills = session.resourceLoader.getSkills().skills.map((skill) => skill.name);
console.log('Loaded skills:', loadedSkills.join(', ') || '(none)');

// session.subscribe((event) => {
// 	if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
// 		process.stdout.write(event.assistantMessageEvent.delta);
// 	}
// });
session.subscribe((event) => {
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


await session.prompt("你好");
// session.state.messages.forEach((msg) => {
// 	console.log(msg);
// });
// console.log();