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
server.registerTool(
  "open-midi-out",
  { description: "Open MIDI-Out port", inputSchema: { port: z.string().optional().describe("Port name") } },
  open_midi_out
);
server.registerTool(
  "send-midi",
  { description: "Send messages to MIDI-Out port",
    inputSchema: {
      port: z.string().optional().describe("Port name"),
      messages: z.array(
        z.object({
          timestamp: z.number().optional().describe("Timestamp (see MIDI time) or none to play immediately"),
          bytes: z.array(z.number().int().min(0).max(255)).describe("Raw MIDI bytes e.g. [144, 60, 80]")
        })
      ).describe("MIDI messages to send")
    }
  },
  send_midi
);

var START_TIME;
var MIDI_OUT = {};

async function _init() {
  if (!START_TIME) {
    await JZZ();
    START_TIME = new Date().getTime();
  }
}
async function get_midi_time() {
  await _init();
  return { content: [ { type: 'text', text: String(new Date().getTime() - START_TIME) } ] };
}
async function list_midi_out() {
  await _init();
  const result = await JZZ().info().outputs.map(x => x.name);
  return { content: [ { type: 'text', text: JSON.stringify(result) } ] };
}
async function list_midi_in() {
  await _init();
  const result = await JZZ().info().inputs.map(x => x.name);
  return { content: [ { type: 'text', text: JSON.stringify(result) } ] };
}
async function open_midi_out({ port }) {
  try {
    var p = await _open_midi_out(port);
    return { content: [ { type: 'text', text: p.name() } ] };
  }
  catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${err.message}` }],
      isError: true,
    };
  }
}
async function _open_midi_out(name) {
  if (MIDI_OUT[name]) return MIDI_OUT[name];
  await _init();
  var port = await JZZ().openMidiOut(name);
  MIDI_OUT[name] = port;
  return port;
}
async function send_midi({ port, messages }) {
  try {
    var p = await _open_midi_out(port);
    // console.error(messages);
    return { content: [{ type: 'text', text: 'OK' }] };
  }
  catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${err.message}` }],
      isError: true,
    };
  }
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
    list_midi_in,
    open_midi_out
  };
}