#!/usr/bin/env node
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const JZZ = require('jzz');

const name = 'midi-mcp';
const version = '0.0.2';
const server = new McpServer({ name, version });

server.registerTool(
  "get_midi_time",
  { description: "Get current MIDI time in milliseconds", inputSchema: {} },
  get_midi_time
);
server.registerTool(
  "list_midi_out",
  { description: "Get the list of MIDI-Out ports", inputSchema: {} },
  list_midi_out
);
server.registerTool(
  "list_midi_in",
  { description: "Get the list of MIDI-In ports", inputSchema: {} },
  list_midi_in
);

var START_TIME;

async function init() {
  if (!START_TIME) {
    await JZZ();
    START_TIME = new Date().getTime();
  }
}
async function get_midi_time() {
  await init();
  return { content: [ { type: 'text', text: new Date().getTime() - START_TIME } ] };
}
async function list_midi_out() {
  await init();
  const result = await JZZ().info().outputs.map(x => x.name);
  return { content: [ { type: 'text', text: JSON.stringify(result) } ] };
}
async function list_midi_in() {
  await init();
  const result = await JZZ().info().inputs.map(x => x.name);
  return { content: [ { type: 'text', text: JSON.stringify(result) } ] };
}

if (require.main === module) {
  const main = async function() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('MIDI MCP Server is running on stdio');
  }
  main();
}
else {
  module.exports = {
    name, version,
    get_midi_time,
    list_midi_out,
    list_midi_in
  };
}