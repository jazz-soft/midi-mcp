# midi-mcp
[![npm](https://img.shields.io/npm/v/midi-mcp.svg)](https://www.npmjs.com/package/midi-mcp)

coming soon...

### Claude for Desktop
MacOS/Linux: `code ~/Library/Application\ Support/Claude/claude_desktop_config.json`  
Windows PowerShell: `code $env:AppData\Claude\claude_desktop_config.json`
```json
{
  "mcpServers": {
    "midi": {
      "command": "npx",
      "args": ["-y", "midi-mcp"]
    }
  }
}
```

### AnythingLLM
macOS: `~/Library/Application Support/anythingllm-desktop/storage/plugins/anythingllm_mcp_servers.json`  
Linux: `~/.config/anythingllm-desktop/storage/plugins/anythingllm_mcp_servers.json`  
Windows PowerShell: `code $env:AppData\anythingllm-desktop\storage\plugins\anythingllm_mcp_servers.json`
```json
{
  "mcpServers": {
    "midi": {
      "command": "npx",
      "args": ["-y", "midi-mcp"]
    }
  }
}
```

### VSCode
`code .vscode\mcp.json`
```json
{
  "servers": {
    "midi": {
      "command": "npx",
      "args": ["-y", "midi-mcp"]
    }
  }
}
```

## Debugging
Instead of the `npx` command, use:
```json
"midi": {
  "command": "node",
  "args": ["/path/to/midi-mcp"]
}
```

### MCP Inspector
`npx @modelcontextprotocol/inspector node /path/to/midi-mcp`