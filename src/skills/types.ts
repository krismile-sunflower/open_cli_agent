import { AgentTool } from '@mariozechner/pi-agent-core';

export interface Skill {
  name: string;
  description: string;
  tools: AgentTool<any, any>[];
  systemPrompt?: string;
}

export function mergeSkills(baseSystemPrompt: string, skills: Skill[]) {
  const allTools = skills.flatMap(s => s.tools);
  const skillPrompts = skills
    .filter(s => s.description)
    .map(s => `[${s.name}]\n${s.description}`);

  const systemPrompt = skillPrompts.length > 0
    ? `${baseSystemPrompt}\n\n--- Skills ---\n\n${skillPrompts.join('\n\n')}`
    : baseSystemPrompt;

  return {
    systemPrompt,
    tools: allTools,
  };
}
