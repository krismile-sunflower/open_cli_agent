import { Type } from '@mariozechner/pi-ai';
import { AgentTool } from '@mariozechner/pi-agent-core';
import { Skill } from './types.js';

const timeSchema = Type.Object({
	label: Type.String({ description: "想用户描述的时间标签" }),
	content: Type.String({ description: "时间内容，格式为YYYY-MM-DD HH:mm:ss" }),
});

const timeTool: AgentTool<typeof timeSchema> = {
  name: 'get_current_time',
  label: 'Get Current Time',
  description: '获取当前时间',
  parameters: timeSchema,
  execute: async () => {
    const result = {
      label: '当前时间',
      content: new Date().toLocaleString(),
    };
    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
      details: result
    };
  }
};

export const timeSkill: Skill = {
  name: 'time',
  description: '当用户询问当前时间时，使用 get_current_time 工具获取当前时间。',
  tools: [timeTool],
};
