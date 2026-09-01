# Fase 4 — MCP-server maken van de URL Shortener

Kopieer onderstaande prompt in Cline's chat om de agent de URL Shortener te laten verpakken als een echte MCP-server.

---

## Prompt (NL)

```
Je hebt de URL Shortener API in src/url_shortener.py met de functies:

- shorten_url(url: str, expiration_hours: int = 24) -> str
- retrieve_url(code: str) -> str | None

Maak een nieuw bestand src/url_shortener_mcp.py dat deze functies
exposeert als een MCP-server met de Python MCP SDK (v2.x).

Requirements:

1. Importeer MCPServer: `from mcp.server.mcpserver import MCPServer`
   (In v1.x heette dit FastMCP, maar de geïnstalleerde versie is v2.x)
2. Maak een MCPServer met name "URL Shortener"
3. Exposeer `shorten_url` en `retrieve_url` als tools met @mcp.tool()
   - Zorg dat elke tool een goede beschrijving heeft (voor het LLM)
   - Behoud de parameters: url, expiration_hours voor shorten_url, code voor retrieve_url
4. Voeg een resource toe "url-shortener://stats" die het aantal actieve URL's toont
5. Start de server met mcp.run(transport="stdio")

Belangrijk:
- Importeer uit url_shortener.py (relatieve import of direct)
- De MCP-server moet via STDIO werken want Cline gebruikt dit
- Test of tools/list werkt: start de server en stuur een JSON-RPC request
```

---

## Prompt (EN, alternatief)

```
You have url_shortener.py with shorten_url() and retrieve_url().

Create src/url_shortener_mcp.py that wraps these as an MCP server
using the Python MCP SDK (v2.x — use MCPServer, not FastMCP).

Requirements:
- MCPServer named "URL Shortener"
- Tools: shorten_url, retrieve_url (with LLM descriptions)
- Resource: "url-shortener://stats" showing active URL count
- STDIO transport

Run with: python src/url_shortener_mcp.py
Test: echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | python src/url_shortener_mcp.py
```

---

## Testen of de MCP-server werkt

```bash
# Start de server en stuur een tools/list request
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | python src/url_shortener_mcp.py
```

Je verwacht een JSON-response met twee tools (shorten_url en retrieve_url)
en één resource (url-shortener://stats).