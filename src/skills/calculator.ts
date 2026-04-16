import { Type } from '@mariozechner/pi-ai';
import { AgentTool } from '@mariozechner/pi-agent-core';
import { Skill } from './types.js';

const calculatorSchema = Type.Object({
  expression: Type.String({ description: '数学表达式，例如 1 + 2 * 3' }),
});

const calculatorTool: AgentTool<typeof calculatorSchema> = {
  name: 'calculator',
  label: 'Calculator',
  description: '计算数学表达式的结果',
  parameters: calculatorSchema,
  execute: async (_id, params) => {
    try {
      const result = eval(params.expression);
      return {
        content: [{ type: 'text', text: String(result) }],
        details: { expression: params.expression, result },
      };
    } catch (e) {
      return {
        content: [{ type: 'text', text: `计算错误: ${e}` }],
        details: { error: String(e) },
        isError: true,
      };
    }
  },
};

export const calculatorSkill: Skill = {
  name: 'calculator',
  description: '当用户需要进行数学计算时，使用 calculator 工具计算表达式的结果。',
  tools: [calculatorTool],
};
