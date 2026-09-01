# Stappenplan: VS Code + Cline Workflow

> **Doel:** Een concrete, praktische gids voor het opzetten van een professionele agentic coding workflow met VS Code en Cline.
> De rode draad: *"Van developer die code schrijft → naar developer die agents stuurt, valideert en bewaakt."*

---

## Overzicht — De 4 Fases

```
Fase 1: Projectfundamenten    → .clinerules, structuur, PRD
Fase 2: Specificatie & Harness → ADR, specs, testinfra (de "harness")
Fase 3: Agent implementeert   → prompt, feedback loop, context compressie
Fase 4: Multi-agent            → opschalen, orchestratie
```

**Kernprincipe:** *Specification Driven Development + Harnessing* = de agent krijgt eerst een helder doel (spec) én een meetlat (harness), daarna pas mag hij implementeren.

---

## Fase 1: Projectfundamenten (30 min)

*Doe dit vóór je de agent 1 regel code laat schrijven.*

### 1.1 Projectstructuur — de voorgestelde layout

```
project/
├── .clinerules              # Agent-aanwijzingen (verplicht!)
├── docs/
│   ├── PRD.md               # Product Requirement Document
│   └── ADR/                 # Architecture Decision Records
│       └── 001-use-python.md
├── specs/                    # Specificatiegedreven ontwikkeling
│   ├── spec-feature-x.md
│   └── spec-api.md
├── harness/                  # Test- en validatie-infrastructuur
│   ├── run_tests.sh          # De "harness" — 1 commando draait alles
│   └── validate.sh           # Optionele extra validatie (lint, types, etc.)
├── src/
├── tests/
└── prompts/                  # Herbruikbare prompts voor agents
    ├── agent-rules.md
    └── context-templates.md
```

**Waarom?** Deze structuur geeft de agent vaste houvast: hij weet waar hij specs vindt (`specs/`), waar hij tests moet plaatsen (`tests/`), en hoe hij feedback krijgt (`harness/run_tests.sh`).

### 1.2 .clinerules — de Agent Rules

Dit is het **belangrijkste bestand** in je project. Cline leest dit automatisch bij elke taak. Het is je permanente instructie aan de agent.

**Verplichte onderdelen in `.clinerules`:**

```markdown
# Agent Rules — projectnaam

## Taal & conventies
- Gebruik Python 3.12+
- Type hints verplicht
- Docstrings: Google-style
- Tests: pytest

## Werkwijze
- Lees altijd eerst de relevante spec uit `specs/` voor je implementeert
- Lees `docs/ADR/` voor architectuur-beslissingen
- Schrijf tests **vóór** implementatie (Spec First!)
- Na elke wijziging: voer `harness/run_tests.sh` uit
- Bij failing tests: los op, herhaal tot alles groen is
- Voeg geen onnodige dependencies toe
- Overschrijf nooit bestaande code zonder overleg

## Constraints
- Budgetlimiet: vraag bij twijfel
- Max 3 retries per failing test, daarna escaleren naar developer
- Geen wijzigingen aan `.clinerules` zonder goedkeuring
- Alle code moet door de harness passen (tests + lint + type check)

## Definitie van Done
- [ ] Alle tests in `tests/` slagen
- [ ] `harness/run_tests.sh` geeft exit code 0
- [ ] Type checker geeft geen fouten
- [ ] Geen ongebruikte imports of variabelen
- [ ] Code voldoet aan de specs in `specs/`
```

> 🔑 **Waarom `.clinerules`?** Het is je *permanente context*. Elk nieuw gesprek met Cline start met deze instructies. Zonder `.clinerules` begint de agent telkens op nul.

### 1.3 PRD — Product Requirement Document voor Agents

Een PRD voor een AI-agent is **anders** dan een traditionele PRD. Waar een menselijke PRD vaag mag zijn ("gebruiksvriendelijke interface"), moet een agent-PRD **expliciet en toetsbaar** zijn.

**Template voor agent-PRD:**

```markdown
# PRD: [Feature naam]

## Doel
Waarom doen we dit? Welk probleem lossen we op?

## Functionele vereisten
- [ ] [Vereiste 1] — toetsbaar: [hoe testen we dit?]
- [ ] [Vereiste 2] — toetsbaar: [hoe testen we dit?]

## Niet-functionele vereisten
- [ ] Performantie: [bv. < 100ms response]
- [ ] Beveiliging: [bv. input validatie verplicht]
- [ ] Onderhoudbaarheid: [bv. max 100 lijnen per functie]

## Definities & concepten
- Term X: [betekenis] — voorkomt misinterpretatie

## Randvoorwaarden
- Wat mag NIET? (expliciet!)
- Welke libraries zijn (niet) toegestaan?

## Definition of Done
- [ ] Alle functionele vereisten getest
- [ ] Harness slaagt (run_tests.sh)
- [ ] Code review door senior developer
```

---

## Fase 2: Specificatie & Harness (1 uur)

*Dit is waar de echte kwaliteit zit. Hoe beter je spec en harness, hoe beter de agent presteert.*

### 2.1 Architecture Decision Records (ADR)

ADR's documenteren **waarom** een architectuurbeslissing is genomen. Dit is cruciaal omdat:
1. Agenten anders willekeurig patronen kiezen
2. Je bij refactors de *redenen* terugziet
3. Context snel verloren gaat zonder documentatie

**Template — elke ADR is 1 bestand in `docs/ADR/`:**

```markdown
# ADR-001: [Titel]

## Status
✅ Geaccepteerd | ⏳ Voorgesteld | ❌ Afgewezen

## Context
Welk probleem vraagt om een beslissing?

## Beslissing
Wat kiezen we? (bv. "We gebruiken FastAPI in plaats van Flask")

## Argumenten
- Pro: [argument 1]
- Contra: [argument 2] — maar we accepteren dit omdat [redenen]

## Gevolgen
- Positief: [bv. betere performance]
- Negatief: [bv. complexere setup]

## Alternatieven overwogen
- Alternatief A: [niet gekozen omdat...]
- Alternatief B: [niet gekozen omdat...]
```

**Wanneer ADR aanmaken?** Bij elke beslissing die impact heeft op:
- Framework/library keuze
- Database/opslag
- API-design (> 1 endpoint)
- Projectstructuur
- Deployment

### 2.2 Specification Driven Development — Concreet

**Specification Driven Development** (spec-first) = je schrijft eerst de spec, dan de tests, *dan pas* de code. De agent volgt deze volgorde, niet andersom.

**Praktische aanpak — 3 stappen:**

```
Stap 1: Spec          → specs/spec-feature.md  (wat moet het doen?)
Stap 2: Tests         → tests/test_feature.py  (hoe meten we dat?)
Stap 3: Implementatie → src/feature.py          (laat agent dit doen)
```

**Concreet voorbeeld — URL Shortener API:**

**Stap 1 — Spec (`specs/spec-url-shortener.md`):**

```markdown
# Spec: URL Shortener API

## Endpoints
- `POST /shorten` — verkort een URL
  - Input: `{ "url": string, "expiration_hours": int }`
  - Output: `{ "short_code": string, "expires_at": datetime }`
  - Validatie: url moet geldig formaat hebben, max 2048 chars

- `GET /{short_code}` — redirect naar originele URL
  - Output: 302 redirect of 404 als verlopen/niet gevonden

## Data
- Opslag: in-memory dictionary (voor MVP)
- Short code: 6 alfanumerieke karakters, random gegenereerd

## Randvoorwaarden
- Geen externe APIs of libraries (behalve standaard lib)
- Alle fouten geven JSON error response met passende HTTP status
```

**Stap 2 — Tests (`tests/test_shortener.py`):**

De agent schrijft deze tests op basis van de spec. De developer reviewt ze.

**Stap 3 — Implementatie:** De agent implementeert tot alle tests slagen.

> 🔑 **Kernregel:** De agent MAG niet beginnen implementeren voor de spec én tests klaar zijn. Dit dwing je af via `.clinerules`.
### 2.3 Harness Engineering — De Feedback Loop

"Harnessing" = het bouwen van een **geautomatiseerde feedback loop** die de agent zelf kan draaien. Hoe sneller de feedback, hoe beter de agent presteert.

**De minimale harness (`harness/run_tests.sh`):**

```bash
#!/bin/bash
# Harness — de feedback loop voor de agent
# Exit code 0 = alles ok, anders = fix nodig

set -e  # stop bij eerste fout

echo "=== 1. Linting ==="
ruff check src/ tests/

echo "=== 2. Type checking ==="
mypy src/ tests/

echo "=== 3. Unit tests ==="
pytest tests/ -v --tb=short

echo "=== 4. Spec validatie ==="
# Optioneel: check of implementatie voldoet aan spec
python -m pytest tests/ -m "spec_validation"

echo "✓ Harness geslaagd!"
```

**Waarom is dit zo krachtig?**

```
Agent schrijft code
    → draait harness
    → harness faalt (bv. test rood)
    → agent ziet foutmelding IN context
    → agent past aan
    → draait harness opnieuw
    → herhaalt tot groen
    → ✓ klaar
```

Zonder harness:
```
Agent schrijft code
    → zegt "klaar!"
    → developer draait tests → 10 fouten
    → developer moet zelf debuggen
    → context verloren
```

---

## Fase 3: Implementatie met de Agent (lopend)

*Hier begint het echte werk. De agent krijgt context, de opdracht en de harness.*

### 3.1 De eerste prompt — context meegeven

**Slechte prompt:** "Build the URL shortener."

**Goede prompt — met context:**

```
Lees eerst:
1. specs/spec-url-shortener.md
2. docs/ADR/001-use-python.md
3. .clinerules

Implementeer de URL Shortener API volgens de spec.
Volg de Spec First approach: specs → tests → code.
Gebruik harness/run_tests.sh voor validatie.
```

**Waarom dit werkt:**
- De agent laadt alle context voordat hij begint
- De volgorde is expliciet: spec, dan tests, dan code
- De harness is de meetlat

### 3.2 Test-Feedback Loop — Concreet

**Wat de agent doet:**

```
1. Lees spec                    → specs/spec-url-shortener.md
2. Schrijf tests                → tests/test_shortener.py
3. Draai: bash harness/run_tests.sh  → tests falen (natuurlijk, nog geen code)
4. Implementeer basis           → src/shortener.py
5. Draai: bash harness/run_tests.sh  → sommige tests slagen
6. Fix tot alles groen          → itereren
7. Done                         → harness exit 0
```

**Developer reviewt:**
- ✅ Spec dekt de requirements?
- ✅ Tests testen de juiste dingen?
- ✅ Code is clean en onderhoudbaar?
- ✅ Harness slaagt?

### 3.3 Context Compression — Tokenmanagement

Context window is **beperkt** en **duur**. Context compression = strategisch omgaan met wat je aan de agent meegeeft.

**Praktische technieken:**

| Techniek | Wat | Besparing |
|---|---|---|
| **Summarization** | Vat lange bestanden samen in 1-2 paragrafen | 50-80% |
| **Pruning** | Verwijder geslaagde tests uit context | 20-40% |
| **ADR als referentie** | Verwijs naar ADR i.p.v. volledige architectuur | 60-90% |
| **Spec-first** | Agent heeft alleen spec nodig, niet volledige codebase | 70-90% |
| **Checkpointing** | Nieuwe Cline-sessie starten per feature | 100% per sessie |

**Concreet voorbeeld — summarization:**

In plaats van een heel PRD-bestand (bv. 5000 tokens) mee te geven:

```markdown
## Samenvatting PRD URL Shortener

Bouw een REST API die URLs verkort met een 6-karakter code.
- POST /shorten → short_code + vervaldatum (1-72 uur)
- GET /{code} → 302 redirect of 404
- In-memory opslag voor MVP
- Zie specs/spec-url-shortener.md voor details
```

**Checkpointing strategie:**

```
Sessie 1: "Bouw de URL Shortener API"
Sessie 2: "Voeg persistentie toe (SQLite)"
Sessie 3: "Voeg rate limiting toe"

Nieuwe sessie = fris context window. Oude context = weg.
Wél: .clinerules blijft altijd beschikbaar.
```
---

## Fase 4: Opschalen — Multi-agent Workflows

*Wanneer 1 agent niet genoeg is, kun je meerdere agents inzetten.*

### 4.1 Wanneer meerdere agents?

| Scenario | 1 agent | Multi-agent |
|---|---|---|
| Eenvoudige feature | ✅ | ❌ overhead |
| Complexe refactor | ⚠️ context vol | ✅ split per module |
| Full-stack feature | ⚠️ context vol | ✅ frontend + backend apart |
| Grote codebase | ❌ context overflow | ✅ per domein/directory |
| CI/CD pipeline | ✅ | ⚠️ overkill |

**Vuistregel:** Start met 1 agent. Schakel naar multi-agent pas als je tegen context-limieten aanloopt.

### 4.2 Concrete multi-agent patronen

**Patroon 1: Sequential Handoff**

```
Agent A (spec schrijver)
    → levert spec.md
    → handoff naar Agent B
Agent B (implementatie)
    → leest spec.md
    → implementeert
    → handoff naar Agent C
Agent C (test-specialist)
    → schrijft extra tests
    → valideert
```

**Hoe aanpakken in Cline:**

1. **Sessie 1** (Cline-gesprek 1): "Schrijf een PRD en spec voor een URL shortener. Leg in `docs/ADR/` de architectuur-beslissingen vast."
2. **Sessie 2** (nieuw Cline-gesprek): "Implementeer de URL shortener volgens `specs/spec-url-shortener.md` en `docs/ADR/001-*`. Gebruik de harness."
3. **Sessie 3** (nieuw Cline-gesprek): "Schrijf uitgebreide integratietests en voer ze uit."

Elke sessie start met een **fris context window**. De documentatie uit sessie 1 is de *brug*.

**Patroon 2: Specialist Agents**

```
Agent Rules (.clinerules):
  - Architect: schrijft ADRs en specs
  - Implementator: bouwt features
  - Tester: schrijft en valideert tests
  - Reviewer: controleert kwaliteit

Per taak kies je de juiste agent-rol via de prompt.
```

**Voorbeeld prompt voor een "Architect"-sessie:**

```
Je rol is Architect.
Je taken:
- Schrijf/update ADRs in docs/ADR/
- Schrijf specs in specs/
- Update .clinerules waar nodig
Je hoeft NIET te implementeren.
Gebruik docs/ voor context.
```

### 4.3 Orchestratie-documentatie

Maak een `docs/WORKFLOW.md` die beschrijft hoe je multi-agent workflow werkt:

```markdown
# Multi-agent Workflow

## Agents
| Rol | Verantwoordelijkheid | Context |
|---|---|---|
| Architect | PRD, ADR, specs | docs/, specs/ |
| Implementator | Code + unit tests | specs/, tests/, src/ |
| Tester | Integratietests, E2E | specs/, tests/ |
| Reviewer | Code review, kwaliteit | volledige codebase |

## Handoff protocol
1. Architect levert spec + ADR
2. Implementator haalt spec op → bouwt
3. Tester valideert → rapporteert issues
4. Reviewer keurt goed of vraagt aanpassingen
5. Bij wijzigingen: start terug bij 1 met verwijzing naar ADR
```
---

## Samenvatting — De 7 Gouden Regels

| # | Regel | Waarom |
|---|---|---|
| 1 | **Start met `.clinerules`** | Permanente context voor elke sessie |
| 2 | **Spec-first, altijd** | Agent weet exact wat te doen |
| 3 | **Bouw de harness eerst** | Feedback loop = kwaliteit |
| 4 | **ADR elke architectuurbeslissing** | Voorkomt willekeur en contextverlies |
| 5 | **Compresseer context** | Bespaart tokens, verbetert focus |
| 6 | **Review elke output** | Agent stelt voor, jij beslist |
| 7 | **Nieuwe sessie per feature** | Fris context window, lagere kosten |

---

## Checklist — Workflow Opzetten

### ☐ Fase 1: Projectfundamenten
- [ ] Projectstructuur aangemaakt (`docs/`, `specs/`, `harness/`, `tests/`, `src/`, `prompts/`)
- [ ] `.clinerules` geschreven met werkwijze, constraints en DoD
- [ ] PRD geschreven met toetsbare vereisten

### ☐ Fase 2: Specificatie & Harness
- [ ] ADR aangemaakt voor elke architectuurbeslissing
- [ ] Specs geschreven in `specs/`
- [ ] Tests geschreven op basis van specs
- [ ] `harness/run_tests.sh` werkend

### ☐ Fase 3: Implementatie
- [ ] Agent gestart met context-rijke prompt
- [ ] Agent doorloopt spec → tests → code → harness loop
- [ ] Context compression toegepast waar nodig
- [ ] Developer review uitgevoerd

### ☐ Fase 4: Opschaling (indien nodig)
- [ ] Multi-agent rollen gedefinieerd
- [ ] Handoff protocol vastgelegd
- [ ] `docs/WORKFLOW.md` bijgewerkt

---

> **De rode draad:** Hoe beter de *context engineering* (PRD, ADR, specs, harness), hoe beter de agent presteert. Tooling-installatie is 10% van het werk; de rest is **hoe je denkt, specificeert en valideert.**