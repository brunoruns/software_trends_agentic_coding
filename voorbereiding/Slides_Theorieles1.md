---
marp: true
theme: ap-theme
paginate: true
---

<!-- _class: title-slide -->

# Theorieles 1 — Van LLM naar Agentic Coding
## Software Trends — Agentic Coding

---

## Inhoud

- LLM's architectuur
- Agent definiëren
- Autocomplete vs Copilot vs Agent
- Moderne agentic workflows
- Systeemdenken in taken, context, feedback loops

---

## 1. Waarom is dit relevant? (15 min)

### Historiek

| Tijdperk | Mens | AI |
|---|---|---|
| Vroeger | schrijft alles | geen |
| Copilot | schrijft meeste | suggesties |
| Agentic | stuurt werk | voert uit |

---

### Evolutie in praktijk

- Klassieke softwareontwikkeling
- IDE met autocomplete
- GitHub Copilot
- AI pair programmer
- **Agentic coding**

**[DEMO]

---

### Voorbeelden — evolutie opdracht

```
"Write function"        → Copilot
"Build feature"         → AI pair programmer
"Add authentication"     → Agentic
"Create entire MVP"     → Agentic
```


---

## 2. Wat is een LLM? (25 min)

### Kernconcepten — uitgediept

| Concept | Uitleg |
|---|---|
| **Taalmodel** | Getraind op enorme tekstcorpus (internet, boeken, code) → leert statistische taalpatronen |
| **Token predictie** | Voorspelt het volgende token op basis van alle voorgaande context; *autoregressief* — elk nieuw token bouwt voort op de vorige |
| **Context window** | Aantal tokens dat het model in één keer kan verwerken. Bij overschrijding wordt oudere informatie "vergeten" (bv. 4K, 8K, 32K, 200K tokens) |

---

### Kernconcepten — uitgediept 
| Concept | Uitleg |
|---|---|
| **Embeddings** | Tekst → dense vector-representatie (512-4096 dimensies). Woorden met gelijkaardige betekenis liggen dicht bij elkaar in vectorruimte. Cruciaal voor *semantisch zoeken*, *retrieval* (RAG) en *similarity* |
| **Reasoning modellen** | Chain-of-thought, zelfreflectie, stap-voor-stap redeneren. Modellen zoals o1, DeepSeek-R1 gebruiken extra tokens om te "denken" voor ze antwoorden |

> 💡 **Samenhang:** Embeddings bepalen *hoe* een model tekst begrijpt, context window bepaalt *hoeveel* het kan verwerken, en token predictie is het *mechanisme* waarmee het genereert.

---

### Waarom deze concepten?

| Concept | Impact op agent |
|---|---|
| **Context window** | Bepaalt hoeveel code/instructies agent in één keer kan verwerken — te klein → agent "vergeet" eerdere instructies |
| **Embeddings** | Bepalen hoe de agent semantische gelijkenis ziet tussen codefragmenten; cruciaal voor RAG en *retrieval* |
| **Tokenisatie** | Niet-westerse talen en code kosten meer tokens dan natuurlijke taal → beïnvloedt effectieve context budget |
| **Hallucinaties** | Agent verzint APIs, bestanden, functienamen — *altijd verifiëren!* |
---
| Concept | Impact op agent |
|---|---|
| **Prompt kwaliteit** | Hoe preciezer en gestructureerder de taakomschrijving, hoe beter het resultaat |
| **Reasoning** | Bepaalt of een agent complexe problemen kan oplossen via stap-voor-stap redeneren of enkel simpele taken aankan |

---

### 🔬 Interactief experimenteren met deze concepten

**[LIVE DEMO] Gebruik deze online tools om zelf te spelen met de concepten:**

| Tool | Wat zie / test je? |
|---|---|
| **[tiktokenizer.vercel.app](https://tiktokenizer.vercel.app/)** | Kies verschillende modellen (GPT-4o, o1, DeepSeek, Qwen) en zie hoe **dezelfde prompt** door elk model anders wordt **getokenized** — aantal tokens, splitsing van woorden, impact op context budget |
| **[bbycroft.net/llm](https://bbycroft.net/llm)** | 3D-visualisatie van een LLM in actie: **embeddings** die worden geladen, **attention layers** die tokens wegen, **token predictie** stap voor stap. Perfect om de architectuur te *zien* |
| **[projector.tensorflow.org](https://projector.tensorflow.org/)** | TensorFlow **Embedding Projector** — laad data en visualiseer hoe embeddings woorden clusteren in 3D. Zie semantische relaties (koning → koningin, lopen → rennen) |
| **[OpenRouter — Model Playground](https://openrouter.ai/playground)** | Vergelijk **verschillende modellen** met exact dezelfde prompt. Test GPT-4o, Claude Sonnet, Gemma, DeepSeek, gratis modellen naast elkaar — zie verschil in snelheid, kwaliteit, hallucinaties |
| **[LMSYS Chatbot Arena](https://lmarena.ai/)** | Blind A/B testen van modellen. Jij geeft een prompt, twee anonieme modellen antwoorden, jij beoordeelt welk beter is — *crowdsourced model ranking* |

---

**🧪 Te onderzoeken variabelen:**

| Wat verander je? | Effect |
|---|---|
| **Ander model** (bv. GPT-4o → Gemma) | Zie verschil in codetaal, precisie, snelheid |
| **Kleinere context** (bv. truncate prompt) | Model "vergeet" eerdere instructies — hallucinaties nemen toe |
| **Prompt zonder context** vs **met veel context** | Zie hoe context window de outputkwaliteit beïnvloedt |
| **Andere embedding / tokenizer** | Zelfde zin, ander aantal tokens — impact op kostprijs en effectieve context |

---

### LLM Vergelijking (via OpenRouter)

**[DEMO] Zelfde probleem geven aan:**

- GPT-4o
- Claude
- Gemma
- DeepSeek
- Gratis modellen

**Bespreek:** snelheid, correctheid, hallucinaties, kosten

---

## 3. Wat is een agent? (25 min)

### Definitie

> **Agent = LLM + Tools + Geheugen + Doelen**

---

### Capabilities

Agent kan:

- Bestanden lezen
- Bestanden aanpassen
- Terminal uitvoeren
- Tests runnen
- Browser gebruiken
- Git commands uitvoeren

---

### Visualisatie

```
         🎯 Goal
           |
         Agent
           |
    +------+------+
    |      |      |
   LLM   Files  Terminal
    |      |      |
  Tests   Git   Browser
```

**[MEDIA] Voeg architectuurdiagram toe — pijlen tonen feedback loops**

---

## 4. Wat is agentic coding? (30 min)

### Workflow

```
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
```

**[DEMO] Laat een agent een feature bouwen + toon elke stap live**

---

### Kernconcepten

| Concept | Betekenis |
|---|---|
| Plan-Act-Observe | Agent maakt plan, voert uit, evalueert resultaat |
| Agent loops | Herhalen tot goal bereikt of max iteraties |
| Tool calling | LLM kiest en roept tools aan |
| Autonomous execution | Zonder menselijke tussenkomst |
| Human approval gates | Checkpoints waar developer moet goedkeuren |

---

## 5. Denken in agents (25 min)

### Mindset shift

| ❌ Vroeger | ✅ Nu |
|---|---|
| "Hoe implementeer ik dit?" | "Hoe **omschrijf** ik dit probleem?" |
| — | "Hoe **verifieer** ik de oplossing?" |
| — | "Hoe kan een agent dit uitvoeren?" |

---

### Framework

| Laag | Vraag |
|---|---|
| **Taken** | Wat moet gebeuren? |
| **Constraints** | Wat mag niet? |
| **Definition of Done** | Wanneer is het klaar? |
| **Validatie** | Hoe weten we dat het werkt? |

**[MEDIA] Werkblad/cheatsheet — 'Prompt template' voor taken beschrijven**

---

## Samenvatting Les 1

- LLM = token predictor met context
- Agent = LLM + tools + doelen
- Workflow = plan → act → observe → loop
- Developer wordt **taakomschrijver + validator**

---

## Vragen?