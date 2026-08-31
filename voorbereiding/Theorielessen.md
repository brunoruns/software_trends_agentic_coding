Dit is een sterk format voor een opleiding van 10 uur totaal (2x theorie + 3x praktijk). Ik zou bewust mikken op een doelgroep van developers die al kunnen programmeren, maar nog weinig ervaring hebben met agentic coding. De rode draad is:

"Van developer die code schrijft → naar developer die agents stuurt, valideert en bewaakt."

# Theorieles 1 (2u)
Van LLM naar Agentic Coding

## Leerdoelen
Na deze sessie kunnen deelnemers:

uitleggen wat een LLM is
uitleggen wat een agent is
het verschil benoemen tussen autocomplete, copilots en agents
begrijpen hoe moderne agentic workflows werken
denken in taken, context en feedback loops

## Lesplan
### Introductie van AI in software engineering
1. Waarom is dit relevant? (15 min)

Historiek:

klassieke softwareontwikkeling
IDE met autocomplete
GitHub Copilot
AI pair programmer
Agentic coding

Toon voorbeelden:

"Write function"
"Build feature"
"Add authentication"
"Create entire MVP"

**Evolutie**:

Tijdperk	|Mens	|AI
Vroeger	|schrijft alles |	geen
Copilot	| schrijft meeste	 | suggereert lijnen
Agentic	| stuurt werk	| voert werk uit

### LLM
2. Wat is een LLM? (25 min)

- taalmodel
- voorspellen van volgende token
- context window
- embeddings
- reasoning modellen

Benadrukken:
- waarom context belangrijk is
- waarom hallucinations ontstaan
- waarom prompts belangrijk zijn

### Demo
Geef hetzelfde probleem aan:

GPT-4o
Claude
Gemma
DeepSeek

Bespreek verschillen.

### Agents
3. Wat is een agent? (25 min)

Definitie:

Een agent = LLM + tools + geheugen + doelen.

Agent kan:

bestanden lezen
bestanden aanpassen
terminal gebruiken
tests uitvoeren
browser gebruiken

Visualisatie:

Goal
 |
Agent
 |
 +-- LLM
 +-- Files
 +-- Terminal
 +-- Tests
 +-- Git

### Agentic coding
4. Wat is agentic coding? (30 min)

Workflow:

Goal
 ↓
Plan
 ↓
Implement
 ↓
Run tests
 ↓
Fix
 ↓
Retest
 ↓
Done


**Concepten**:

plan-act-observe
agent loops
tool calling
autonomous execution
human approval gates

### Denken in agents
5. Denken in agents (25 min)

Ontwikkelaars moeten leren denken in:

Niet:

Hoe implementeer ik dit?


Maar:

Hoe *omschrijf* ik dit probleem?
Hoe *verifieer* ik de oplossing?
Hoe kan een agent dit uitvoeren?


Framework:

**Taken**: Wat moet gebeuren?
**Constraints**: Wat mag niet?
**Definition of done**: Wanneer is werk klaar?
**Validatie**: Hoe weten we dat het werkt?

# Theorieles 2 (2u)
Risico's, controle en toekomst van de developer

## Leerdoelen
risico's herkennen
AI-output kritisch beoordelen
economische impact begrijpen
relevante developer skills identificeren

## Lesplan

### Waar gaat agentic coding fout? (30 min)

Gekende problemen:

**Hallucinaties**: Bestaande APIs verzinnen.
**Schijnbaar correcte code**: Code compileert, mMaar voldoet niet aan requirements.
**Context drift**: Agent vergeet oorspronkelijke doel.
**Dependency chaos**: Onnodige libraries toevoegen.
**Infinite loops**: Agent blijft dezelfde fout proberen oplossen.

### Kosten van agentic coding (20 min)

Veel developers onderschatten:

Prompt
→ antwoord
→ tool call
→ analyse
→ edit
→ test
→ retry

**Tokenverbruik loopt snel op.**

Bespreek:

OpenRouter
Claude
Gemini
DeepSeek
lokale modellen


### Human in the Loop (30 min)

Developer wordt:
- architect
- reviewer
- validator
- product thinker

Minder:
code typist

Belangrijke gewoonte:
**Nooit blind accepteren.**

Checklist:
- klopt requirement?
- klopt design?
- klopt security?
- klopt testing?
- klopt architectuur?


### Welke skills verliezen waarde? (20 min)

- boilerplate schrijven
- CRUD schermen bouwen
- eenvoudige API wrappers
- syntaxis memoriseren


### Welke skills worden belangrijker? (20 min)

Veel belangrijker:

**Requirements engineering**: Kan je het probleem uitleggen?
**Architectuur**: Kan je grenzen definiëren?
**Testen**: Kan je kwaliteit meten?
**Systems thinking**: Kan je grote systemen begrijpen?
**AI orchestration**: Kan je meerdere agents aansturen?