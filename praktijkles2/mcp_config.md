# MCP Configuratie voor Cline in VS Code

Wat is dit bestand? Het legt uit hoe je MCP-servers aan Cline koppelt.

---

## Wat is Cline's MCP config?

Cline leest MCP-server configuratie uit een JSON-bestand.
Per server geef je: het **commando**, de **argumenten**, en de **werkmap**.

**Lokaal bestand** (per project, deze les):

```
praktijkles2/.vscode/cline_mcp_settings.json
```

**Globaal bestand** (voor alle projecten):

```
~/.vscode-server/data/User/globalStorage/
  saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

---

## Structuur van een MCP-instelling

```json
{
  "mcpServers": {
    "url-shortener": {
      "command": "python",
      "args": ["src/url_shortener_mcp.py"],
      "cwd": "${workspaceFolder}",
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

| Veld | Uitleg |
|---|---|
| `command` | Het commando om de server te starten (`python`, `node`, `npx`, `uv`) |
| `args` | Argumenten voor het commando |
| `cwd` | Werkmap (`${workspaceFolder}` = project root) |
| `env` | Omgevingsvariabelen |
| `disabled` | Zet op `true` om de server tijdelijk uit te schakelen |
| `autoApprove` | Lijst van tool names die geen bevestiging nodig hebben |

---

## Transport-types

Cline ondersteunt **STDIO** voor lokale servers:

```
┌────────┐  stdin/stdout  ┌──────────────┐
│  Cline │◄─────────────►│ MCP Server   │
│  (host)│  JSON-RPC 2.0  │ (Python proc)│
└────────┘                └──────────────┘
```

Voor remote servers is er **Streamable HTTP** (SSE):

```json
{
  "mcpServers": {
    "remote-api": {
      "command": "npx",
      "args": [
        "-y", "@modelcontextprotocol/client",
        "--url", "https://api.example.com/mcp"
      ]
    }
  }
}
```

---

## Foutzoeken

| Probleem | Oplossing |
|---|---|
| Server start niet | Controleer of `command` en `args` kloppen, of de dependencies geïnstalleerd zijn |
| Status "Disconnected" | Herstart VS Code of herlaad het venster |
| Tool niet zichtbaar | Controleer of de `@mcp.tool()` decorator correct is |
| Timeout | Sommige tools hebben `autoApprove` nodig |
| Geen suggestie van tool | Soms moet je de tool expliciet vermelden in je prompt aan Cline |

---

## Voorbeelden van MCP-servers

**Bestandssysteem**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

**Publieke APIs**:
```json
{
  "mcpServers": {
    "weer": {
      "command": "npx",
      "args": ["-y", "@openbnb/mcp-server-weer"]
    }
  }
}
```

**Zoeken** in de [MCP Registry](https://github.com/modelcontextprotocol/servers) voor meer.