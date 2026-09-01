# Praktijkles 2 — Test-Driven Development + Agent Loop (2u)

## Overzicht

In deze les leer je twee dingen tegelijk:

1. **Test-Driven Development (TDD)** als denkmodel (niet alleen als testtechniek)
2. **Model Context Protocol (MCP)** — de standaard voor AI-agenten om met externe systemen te communiceren

Je bouwt een **URL Shortener API** met behulp van een AI-agent (Cline), waarbij je TDD toepast in een iteratieve agent-loop.

---

## Deel 1 — Intro TDD (20 min)

### De TDD-cyclus

TDD draait om drie stappen: **Rood → Groen → Refactor**.

```
┌──────────┐
│  🔴 RED  │  Schrijf een test die **faalt** (rood).
└────┬─────┘
     │
     ▼
┌──────────┐
│  🟢 GREEN│  Schrijf **net genoeg** code om de test te laten slagen.
└────┬─────┘
     │
     ▼
┌──────────────┐
│  🔵 REFACTOR │  Verbeter de code, hou de test groen.
└──────────────┘
     │
     ▼  (herhaal)
```

### TDD als denkmodel (geen testtechniek)

TDD is niet bedoeld om **alle** scenario's te testen. Het is een **ontwerpmethode**:

- **Red**: Je dwingt jezelf na te denken over *wat* de code moet doen, vóórdat je schrijft *hoe*.
- **Green**: Je schrijft de eenvoudigst mogelijke oplossing — geen over-engineering.
- **Refactor**: Je maakt de code beter terwijl het blijft werken.

> "TDD is niet hoe je testen schrijft. Het is hoe je code ontwerpt die getest kan worden."

### Waarom TDD met een AI-agent?

Een AI-agent (zoals Cline) heeft **heldere, verifieerbare doelen** nodig. Tests zijn perfect daarvoor:

| Zonder tests | Met tests |
|---|---|
| Agent schrijft wat hij denkt | Agent moet aan spec voldoen |
| Geen feedback over kwaliteit | Tests geven directe feedback |
| Vaak slordige of half-werkende code | Code is aantoonbaar correct |
| Mens moet alles handmatig controleren | Tests controleren automatisch |

---

## Deel 2 — Intro MCP (20 min)
### Wat is MCP?

**MCP** (Model Context Protocol) is een open standaard voor het verbinden van AI-applicaties met externe systemen. Het is ontwikkeld door Anthropic en inmiddels breed ondersteund door clients zoals Claude Desktop, VS Code, Cursor en vele anderen.

💡 **Analogie**: Denk aan MCP als **USB-C voor AI**. USB-C standaardiseert hoe apparaten verbinding maken; MCP standaardiseert hoe AI-agenten verbinding maken met data, tools en systemen.

### Waarom is MCP belangrijk?

- **Voor ontwikkelaars**: Bouw één keer een integratie, en elke MCP-compatibele AI-client kan ermee werken.
- **Voor AI-agenten**: Krijg toegang tot een ecosysteem van databronnen, tools en apps.
- **Voor eindgebruikers**: Krachtigere AI-assistenten die écht actie kunnen ondernemen.

### Hoe werkt MCP?

MCP gebruikt een **client-server architectuur** met drie rollen:

```
┌─────────────────────────────────────────────────────────┐
│                    MCP HOST                             │
│              (AI-applicatie, bv. VS Code)               │
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│  │ MCP      │    │ MCP      │    │ MCP      │           │
│  │ Client 1 │    │ Client 2 │    │ Client N │           │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘           │
│       │               │               │                 │
└───────┼───────────────┼───────────────┼─────────────────┘
        │               │               │
        ▼               ▼               ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│ MCP      │    │ MCP      │    │ MCP      │
│ Server 1 │    │ Server 2 │    │ Server N │
│ (bv.     │    │ (bv.     │    │ (bv.     │
│  Sentry) │    │  Bestand │    │  Weer-   │
│          │    │  -systeem│    │  API)    │
└──────────┘    └──────────┘    └──────────┘
```

1. **MCP Host**: De AI-applicatie (bijv. VS Code met Cline, Claude Desktop)
2. **MCP Client**: Eén verbinding per server, aangemaakt door de host
3. **MCP Server**: Een programma dat context (data, tools, prompts) aanbiedt

### MCP Primitives

Een MCP-server kan **drie soorten capaciteiten** aanbieden:

| Primitive | Wie controleert? | Wat doet het? | Voorbeeld |
|---|---|---|---|
| **🔧 Tools** | Model-gestuurd | Voer acties uit, roep APIs aan | `create_task()`, `send_email()` |
| **📄 Resources** | App-gestuurd | Deel data als context | Bestanden, database schema's |
| **💬 Prompts** | Gebruiker-gestuurd | Gestructureerde instructies | Code-review prompt, uitleg-prompt |

#### Tools (core concept)

Tools zijn **functies die een AI-model kan aanroepen**. Ze stellen de agent in staat om databases te bevragen, APIs aan te roepen, berekeningen uit te voeren, en bestanden te lezen/schrijven. Elke tool heeft een **naam**, een **beschrijving** en een **input schema** (JSON Schema).

**Voorbeeld**
```json
{
  "name": "get_user",
  "description": "Zoekt een gebruiker op basis van e-mailadres.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "email": {
        "type": "string",
        "format": "email",
        "description": "E-mailadres van de gebruiker"
      },
      "includeManager": {
        "type": "boolean",
        "description": "Voeg managerinformatie toe",
        "default": false
      }
    },
    "required": ["email"]
  }
}
```

Geldige input zou dan zijn:
```json
{
  "email": "jan.jansen@contoso.com",
  "includeManager": true
}
```

#### Hoe ontdekt een client tools?

```
▶ Verzoek:  tools/list
◀ Antwoord: lijst van beschikbare tools met schema's
▶ Verzoek:  tools/call { name: "shorten_url", arguments: { url: "..." } }
◀ Antwoord: tool resultaat (short URL)
```

### MCP in Cline / VS Code

Cline (de extensie in VS Code) is een **MCP host**. Het kan verbinding maken met MCP-servers via:
- **STDIO transport**: Lokaal proces (bv. een Node.js/Python script)
- **Streamable HTTP transport**: Remote server (bv. een API op het internet)

In deze les gebruiken we géén aparte MCP-server. De **Cline-agent zelf** fungeert als 'tool executor' — hij schrijft, leest en voert Python-code uit alsof het tools zijn. Het concept van **tools ontdekken en aanroepen** is exact hetzelfde als bij een echte MCP-server.

---

## Deel 3 — Opdracht: URL Shortener API

### De opdracht

Bouw een **URL Shortener API** met de volgende features:

| Feature | Beschrijving |
|---|---|
| **`shorten_url(url)`** | Krijgt een lange URL → geeft een korte code terug |
| **`retrieve_url(code)`** | Krijgt een korte code → geeft de originele URL terug |
| **`expiration`** | URL's verlopen na een bepaalde tijd (default: 24 uur) |

**Taal:** Python of andere taal naar keuze (geen externe libraries — gebruik standaard libs zoals `json`, `time`, `hashlib`)

### Fase 1 — Alleen tests (20 min)

Laat de AI-agent **alleen tests schrijven**, nog geen implementatie.

**Doel:** Een set tests die de API specificeren.

**Prompt aan de agent** (kopieer in Cline's chat):

> Zie `prompts/fase1_tests.md`

### Fase 2 — Implementatie (20 min)

Laat de agent de code implementeren op basis van de tests.

**Doel:** De tests groen maken.

**Prompt aan de agent**:

> Zie `prompts/fase2_implementatie.md`

### Fase 3 — Iteratie (25 min)

Laat de agent itereren in een **test → fix → test → fix** loop.

```
test ↓ fix ↓ test ↓ fix ↓ ... tot alles groen is
```

Gebruik de **harness** (`run_tests.sh`) om dit te automatiseren:

```bash
while true; do
    python -m pytest src/test_url_shortener.py -v 2>&1 | head -50
    if [ $? -eq 0 ]; then
        echo "✅ Alle tests geslaagd!"
        break
    fi
    echo "❌ Tests falen — agent moet fixen..."
    sleep 5
done
```

**Prompt aan de agent**:

> Zie `prompts/fase3_iteratie.md`

### Bonus — Vergelijking

Als je tijd hebt: voer dezelfde opdracht uit **zonder eerst tests te schrijven** en vergelijk de resultaten.

| Criterium | Zonder tests | Met tests |
|---|---|---|
| Codekwaliteit | | |
| Correctheid | | |
| Tijd tot oplevering | | |
| Houdbaarheid | | |

De ervaring leert: de resultaten zijn **zeer overtuigend** in het voordeel van de TDD-aanpak.

---

## Deel 4 — Externe MCP-server aansluiten via Cline (20 min)

In dit deel maak je de cirkel rond: de URL Shortener wordt een **echte MCP-server** die je aan **Cline in VS Code** koppelt. Je AI-agent krijgt dan via MCP toegang tot de `shorten_url` en `retrieve_url` tools.

### Stap 1 — Python MCP SDK installeren

```bash
pip install mcp
```

Of via de requirements file:

```bash
pip install -r src/requirements_mcp.txt
```

### Stap 2 — MCP-server laten maken door de agent

Gebruik de prompt uit `prompts/fase4_mcp_server.md` om de agent een MCP-server te laten maken die de URL Shortener functies als tools exposeert.

**Wat de code moet doen:**
- Importeer `shorten_url`, `retrieve_url` uit `url_shortener.py`
- Maak een `MCPServer` (`name="URL Shortener"`)
- Exposeer `shorten_url` en `retrieve_url` als **tools** (met `@mcp.tool()`)
- Voeg een **resource** toe: `url-shortener://stats` (toont actieve URL's)
- Start met STDIO transport

**Codevoorbeeld** (referentie in `src/url_shortener_mcp.py`):

```python
from mcp.server.mcpserver import MCPServer
from url_shortener import shorten_url as _shorten, retrieve_url as _retrieve, _store

mcp = MCPServer("URL Shortener")

@mcp.tool()
def shorten_url(url: str, expiration_hours: int = 24) -> str:
    """Verkort een lange URL tot een korte unieke code."""
    return _shorten(url, expiration_hours)

@mcp.tool()
def retrieve_url(code: str) -> str | None:
    """Haal de originele URL op via een korte code."""
    return _retrieve(code)

@mcp.resource("url-shortener://stats")
def get_stats() -> str:
    """Geeft statistieken over de URL Shortener."""
    return f"Totaal opgeslagen: {len(_store)}"

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

### Stap 3 — Test de MCP-server

MCP gebruikt **JSON-RPC 2.0**. Eerst moet de client handshaken (initialize), daarna pas tools/list.

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2026-07-28","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' | python src/url_shortener_mcp.py
```

Je verwacht een JSON-response met:
1. **Initialize result** — serverInfo met `"name":"URL Shortener"`

### Stap 4 — Koppelen aan Cline via settings.json

Maak `.vscode/cline_mcp_settings.json` aan in de `praktijkles2/` map:

```bash
mkdir -p .vscode
```

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

**Uitleg velden:**

| Veld | Betekenis |
|---|---|
| `command` | Het commando om de server te starten (`python`) |
| `args` | Argumenten: het pad naar het MCP-server script |
| `cwd` | Werkmap (`${workspaceFolder}` = project root) |
| `disabled` | `false` = server wordt opgestart bij Cline |
| `autoApprove` | Leeg = gebruiker moet elke tool-aanroep bevestigen |

### Stap 5 — Herstart Cline en test

1. **Herstart VS Code** (Ctrl+Shift+P → "Developer: Reload Window")
2. Open de Cline extensie (pictogram in de linker toolbar)
3. Klik op het **MCP-knopje** (🔌) in de toolbar van Cline
4. Je zou `url-shortener` moeten zien met status **Connected** 🟢
5. Vraag aan Cline:

> *"Gebruik de url-shortener MCP server om deze URL te verkorten: https://example.com/heel/lange/path"*

**Wat er gebeurt (achter de schermen):**

```
Jij                       Cline (MCP Host)              MCP Server (Python)
 │                              │                              │
 │  "Verkort deze URL"         │                              │
 │─────────────────────────────►│                              │
 │                              │  tools/list                  │
 │                              │─────────────────────────────►│
 │                              │◄─────────────────────────────│
 │                              │  shorten_url(url, exp_hours) │
 │                              │  retrieve_url(code)          │
 │                              │                              │
 │                              │  tools/call                  │
 │                              │  shorten_url("https://...")  │
 │                              │─────────────────────────────►│
 │                              │◄─────────────────────────────│
 │                              │  "abc123"                    │
 │◄─────────────────────────────┤                              │
 │  "De korte code is abc123"  │                              │
```

Gefeliciteerd! 🎉 Je hebt een **functionerende MCP-server** gebouwd en aan je AI-agent gekoppeld.

### Stap 6 (geavanceerd) — Resources toevoegen

De MCP-server heeft al een resource `url-shortener://stats`. Laat de agent een extra resource toevoegen die alle actieve URL's toont:

```python
@mcp.resource("url-shortener://urls")
def list_urls() -> str:
    """Lijst van alle actieve verkorte URL's."""
    import json, time
    now = time.time()
    active = {k: v for k, v in _store.items()
              if now - v["created_at"] < v["expiration_hours"] * 3600}
    return json.dumps(active, indent=2)
```

### Stap 7 (bonus) — Externe MCP-server testen

Voeg een publieke MCP-server toe, bijvoorbeeld een weer-API. Zoek in de [MCP Servers Registry](https://github.com/modelcontextprotocol/servers) naar een interessante server.

```json
{
  "mcpServers": {
    "url-shortener": { ... },
    "weer-api": {
      "command": "npx",
      "args": ["-y", "@openbnb/mcp-server-weer"]
    }
  }
}
```

Cline kan tools uit **meerdere servers tegelijk** combineren! Vraag bijvoorbeeld:

> *"Wat is het weer in Amsterdam? En verkort deze URL: https://example.com"*

---

## Structuur

```
praktijkles2/
├── instructions.md              ← dit bestand
├── mcp_config.md                ← MCP configuratie-handleiding
├── prompts/
│   ├── fase1_tests.md           ← prompt: alleen tests schrijven
│   ├── fase2_implementatie.md   ← prompt: implementeer op basis van tests
│   ├── fase3_iteratie.md        ← prompt: iteratieve fix-loop
│   └── fase4_mcp_server.md      ← prompt: maak een MCP-server
└── src/
│   ├── url_shortener.py         ← implementatie (wordt gegenereerd)
│   ├── test_url_shortener.py    ← tests (worden gegenereerd)
│   ├── run_tests.sh             ← harness voor de iteratie-loop
│   ├── url_shortener_mcp.py     ← MCP-server (referentie)
│   └── requirements_mcp.txt     ← dependencies voor MCP
└── .vscode/
    └── cline_mcp_settings.json  ← Cline MCP configuratie (te maken in stap 4)
```

---

## Bronnen

- 📖 [Model Context Protocol — Officiële documentatie](https://modelcontextprotocol.io/)
- 📐 [MCP Specification](https://spec.modelcontextprotocol.io/)
- 🐍 [Python MCP SDK (MCPServer)](https://github.com/modelcontextprotocol/python-sdk)
- 🧩 [Cline (VS Code extensie)](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)
- 🔌 [MCP Servers Registry](https://github.com/modelcontextprotocol/servers)
- 🔗 [OpenRouter — model-toegang](https://openrouter.ai/)
- 🔗 [Artificial Analysis — modellen vergelijken](https://artificialanalysis.ai/)