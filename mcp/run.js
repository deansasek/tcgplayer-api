#!/usr/bin/env node
// Wrapper to launch the MCP server from the SDK package
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = join(__dirname, '..', 'dist', 'mcp', 'server.js');

spawn('node', [serverPath], {
  stdio: 'inherit',
  cwd: join(__dirname, '..'),
});
