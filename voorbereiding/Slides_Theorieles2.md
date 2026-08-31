---
marp: true
theme: ap-theme
paginate: true
---

<!-- _class: title-slide -->

# Theorieles 2 — Risico's, Controle en Toekomst
## Software Trends — Agentic Coding

---

## Leerdoelen

- Risico's herkennen
- AI-output kritisch beoordelen
- Economische impact begrijpen
- Relevante developer skills identificeren

---

## 1. Waar gaat agentic coding fout? (30 min)

### Gekende problemen — overzicht

| Probleem | Symptoom |
|---|---|
| Hallucinaties | APIs, bibliotheken bestaan niet |
| Schijnbaar correct | Code compileert, voldoet niet |
| Context drift | Agent vergeet oorspronkelijk doel |
| Dependency chaos | Onnodige libraries toegevoegd |
| Infinite loops | Blijft zelfde fout oplossen |

**[DEMO] Toon een hallucinatie — agent gebruikt niet-bestaande API**

---

### Hallucinaties

- **Oorzaak:** LLM "vult in" op basis van patronen
- **Gevolg:** Verzonnen functies, endpoints, packages
- **Oplossing:** Altijd valideren tegen echte documentatie

**[MEDIA] Screenshot van hallucinatie — bv. agent roept fictieve API aan**

---

### Schijnbaar correcte code

- Code draait zonder fouten
- Voldoet **niet** aan requirements
- Mist edge cases, beveiliging, error handling

**Oorzaak:** Gebrek aan domeinkennis bij LLM

---

### Context drift

- Start: duidelijk doel
- Na 5-10 iteraties: zijpad ingeslagen
- Oorzaak: agent verlaten van oorspronkelijke instructie

**Oplossing:** Heldere DoD + human review gates

---

### Dependency chaos

Agent voegt toe zonder overleg:

```
npm install express  (al aanwezig)
npm install lodash   (onnodig)
npm install axios    (fetch is ingebouwd)
```

**[MEDIA] Toon screenshot — package.json met onnodige dependencies**

---

### Infinite loops

```
Fix bug
  → test fails
  → fix anders
  → test fails
  → fix anders...
```

**Oplossing:** max retries, timeout, human escalation

---

## 2. Kosten van agentic coding (20 min)

### Tokenverbruik — onderschat probleem

```
Prompt
  → Antwoord
  → Tool call
  → Analyse
  → Edit
  → Test
  → Retry
```

💰 **1 simpele bugfix kan duizenden tokens kosten**

---

### Aanbieders vergeleken

| Model | Kostprijs | Snelheid | Kwaliteit |
|---|---|---|---|
| OpenRouter (diverse) | Variabel | afhankelijk | wisselend |
| Claude (Anthropic) | $$$ | traag | hoog |
| Gemini (Google) | $$ | snel | goed |
| DeepSeek | $ | snel | goed |
| Lokaal (LLaMA, Qwen) | €€€ (hardware) | variabel | matig |

**[MEDIA] Voeg kostengrafiek per taak toe** — bv. cost per feature, per bugfix

---

### Bespaartips

- Gebruik goedkope modellen voor eenvoudige taken
- Duur model alleen voor complexe redeneringen
- Beperk context window (minder tokens)
- Caching van veelgebruikte context

**[DEMO] Laat kostenverschil zien:** zelfde taak met Claude vs DeepSeek

---

## 3. Human in the Loop (30 min)

### Nieuwe rol van de developer

| Minder | Meer |
|---|---|
| Code typist | **Architect** |
| — | **Reviewer** |
| — | **Validator** |
| — | **Product thinker** |

---

### Belangrijkste gewoonte

> 🚫 **Nooit blind accepteren**

Elke agent-output = **voorstel**, geen eindproduct

---

### Review Checklist

| Check | Vraag |
|---|---|
| ✅ Requirement | Klopt het met de vraag? |
| ✅ Design | Past het in de architectuur? |
| ✅ Security | Geven we geen toegang prijs? |
| ✅ Testing | Zijn edge cases gedekt? |
| ✅ Architectuur | Houdt het systeem gezond? |

**[MEDIA] Werkblad — 'Agent Review Checklist' als handout**

---

### Approval Gates

```
Agent voorstel
  → Developer review
  → Goedkeuring? 
    → Ja: agent implementeert
    → Nee: feedback, agent past aan
```

**[DEMO] Laat approval gate zien in Cline/CodeGate — accepteren/aanpassen**

---

## 4. Welke skills verliezen waarde? (20 min)

### Dalende waarde

- Boilerplate schrijven
- CRUD schermen bouwen
- Eenvoudige API wrappers
- Syntax memoriseren

**Agentic coding automatiseert** deze taken

---

### Blijvende waarde — skills stijgen

| Skill | Waarom belangrijk |
|---|---|
| **Requirements engineering** | Probleem kunnen uitleggen |
| **Architectuur** | Grenzen definiëren, patronen kiezen |
| **Testen** | Kwaliteit meten en waarborgen |
| **Systems thinking** | Grote systemen begrijpen |
| **AI orchestration** | Meerdere agents aansturen |

---

### Skills — vooruitblik

```
2020: "Hoe schrijf ik deze functie?"
2025: "Hoe ontwerp ik deze feature?"
2030: "Hoe orchestreer ik 10 agents?"
```

**[MEDIA] Tijdlijn infographic — evolutie developer skills 2020-2030**

---

### Conclusie

> **Developer 2026 = Architect + Reviewer + Orchestrator**

- Laat agent het typewerk doen
- Jij bewaakt de **kwaliteit, context en visie**

---

## Samenvatting Les 2

- **Risico's:** hallucinaties, drift, loops, kosten
- **Kosten:** tokens tellen, modelkeuze, caching
- **Human in the loop:** altijd reviewen
- **Toekomst:** architect, orchestration, domeinkennis

---

## Discussie / Vragen

- Welke risico's herken je?
- Hoe ga jij agentic coding inzetten?
- Wat zie jij als grootste valkuil?