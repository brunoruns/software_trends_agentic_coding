---
marp: true
theme: ap-theme
paginate: true
---

# Praktijk 2 (2u)
## Test Driven Development + Agent Loop + MCP

Mogelijk de belangrijkste sessie.

---

### Intro TDD (20 min)

Leg uit:

Red
Green
Refactor

Niet als testtechniek.
Maar als denkmodel.

### Intro MCP (20 minuten)

- Wat is MCP? (USB-C voor AI)
- Architectuur: Host → Client → Server
- Drie primitives: **Tools**, **Resources**, **Prompts**
- Hoe tool discovery werkt: `tools/list` → `tools/call`
- Cline als MCP-host in VS Code

---

### TODO Bruno MCP:
- MCP is protocol om glue code tussen API's te vervangen, is geen vervanging van een API an sich
- MCP laat toe om API login credentials secure, centraal te beheren op een MCP server, zodat de LLm daar geen directe toegang tot heeft
- Zero glue code tussen elk AI model en elke denkbare tool, dankzij het Protocol (P in MCP)
- Model (M in MCP) : discover tools, and then DECIDE which one to use
- Context (C in MCP) : APi is op zichzelf stateless, maar een LLM en MCP hebben wel een state (denk API menu, ober is MCP, die laatste heeft een geheugen)

Praktisch: opzetten van een MCP-server met Tailscale (& Aperture ?)

---

**Opdracht**

Bouw:
URL Shortener API

Features:
- shorten URL
- retrieve URL
- expiration

**Fase 1**
Alleen tests.
Laat agent tests schrijven.

**Fase 2**
Laat agent implementeren.

**Fase 3**

Agent laten itereren.

test → fix → test → fix → ... tot alles groen is.

---

### Deel 4 — MCP-server aansluiten (20 min)

Verpak de URL Shortener als **echte MCP-server**:

```python
from mcp.server.mcpserver import MCPServer
mcp = MCPServer("URL Shortener")

@mcp.tool()
def shorten_url(url: str, expiration_hours: int = 24) -> str: ...
```

Koppel aan Cline via `cline_mcp_settings.json`.

Vraag Cline:
> "Gebruik de MCP-server om deze URL te verkorten."

---

**Bonus — Vergelijking**

Zonder tests vs met tests.

Resultaten zijn doorgaans zeer overtuigend.

**Bonus 2**

Voeg een publieke MCP-server toe (bv. weer-API).
Cline kan tools uit meerdere servers combineren!

