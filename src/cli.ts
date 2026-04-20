#!/usr/bin/env node
import 'dotenv/config';
import { parseArgs } from 'node:util';
import {
  createAgentSessionServices,
  createAgentSessionFromServices,
  createAgentSessionRuntime,
  SessionManager,
  getAgentDir,
  bashTool,
  readTool,
  editTool,
  writeTool,
  grepTool,
  findTool,
  lsTool,
  InteractiveMode,
  runPrintMode,
  type CreateAgentSessionRuntimeFactory,
} from '@mariozechner/pi-coding-agent';
import { CLI_NAME, CLI_VERSION, MODEL, createAuth } from './config.js';

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    print: { type: 'boolean', short: 'p' },
    version: { type: 'boolean', short: 'v' },
    help: { type: 'boolean', short: 'h' },
  },
  allowPositionals: true,
});

if (values.version) {
  console.log(`${CLI_NAME} v${CLI_VERSION}`);
  process.exit(0);
}

if (values.help) {
  console.log(`Usage: ${CLI_NAME} [options] [message]

Options:
  -p, --print    Non-interactive: send message, print response, exit
  -v, --version  Show version
  -h, --help     Show this help

Examples:
  ${CLI_NAME}                     Start interactive session
  ${CLI_NAME} "Fix the bug"       Start interactive session with initial message
  ${CLI_NAME} -p "What is 2+2?"  Print response and exit
`);
  process.exit(0);
}

const initialMessage = positionals.join(' ').trim() || undefined;

if (values.print && !initialMessage) {
  console.error(`${CLI_NAME}: --print requires a message argument`);
  process.exit(1);
}

const cwd = process.cwd();
const agentDir = getAgentDir();
const authStorage = createAuth();

const factory: CreateAgentSessionRuntimeFactory = async ({ cwd: sessionCwd, agentDir: sessionAgentDir, sessionManager }) => {
  const services = await createAgentSessionServices({
    cwd: sessionCwd,
    agentDir: sessionAgentDir,
    authStorage,
  });
  const result = await createAgentSessionFromServices({
    services,
    sessionManager,
    model: MODEL,
    tools: [bashTool, readTool, editTool, writeTool, grepTool, findTool, lsTool],
  });
  return { ...result, services, diagnostics: services.diagnostics };
};

const sessionManager = SessionManager.create(cwd);
const runtime = await createAgentSessionRuntime(factory, { cwd, agentDir, sessionManager });

if (values.print) {
  const exitCode = await runPrintMode(runtime, { mode: 'text', initialMessage });
  await runtime.dispose();
  process.exit(exitCode);
} else {
  const mode = new InteractiveMode(runtime, { initialMessage });
  await mode.init();
  await mode.run();
  await runtime.dispose();
}
