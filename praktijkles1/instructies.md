# Praktijkles 1 — Eerste Agent Pipeline (2u)

## Overzicht
Je zet in deze les een volledige AI-agent workflow op met **VS Code**, **Cline** en **OpenRouter**.

---

## Deel 1 — Setup (30 min)

### Installatie
- [VS Code](https://code.visualstudio.com/)
- Extensie: **Cline** (zoek in de marketplace)
- Account: [OpenRouter](https://openrouter.ai/) (gratis credits)
- Opgepast, er zijn beperkingen: 50 requests per dag / 20 per minuut - dit is niet veel!

### Modellen om te testen
| Model        | Prijs (per 1M tokens) |
|--------------|-----------------------|
| DeepSeek V3  | ~€0.30               |
| Qwen 2.5     | ~€0.35               |
| Gemini Flash | ~€0.10               |
| :free | gratis               |

Probeer ze en vergelijk snelheid, kwaliteit en prijs.

---

## Deel 2 — Eerste Pipeline (30 min)

**Project:** `Task Manager CLI`

**Prompt aan de agent:**
> Build a task manager CLI.  
> Requirements: create task, list task, mark done.  
> Use Python. Write tests.

**Doel:** Laat Cline zelf code genereren, testen schrijven en uitvoeren.

---

## Deel 3 — Harness Engineering (45 min)

Een **harness** geeft de agent feedback zodat hij kan itereren.

### Maak `run_tests.sh`
Dit script:
1. Start de agent met een vaste prompt.
2. Voert de gegenereerde tests uit.
3. Toont fouten → agent past aan → opnieuw testen.

### Feedback-loop
```
Code schrijven → tests runnen → fouten → fixen → tests runnen
```

Herhaal tot alle tests groen zijn.

---

## Deel 4 — Reflectie (15 min)

- Wat deed de agent goed?
- Wat deed hij fout?
- Welk model werkte het best?

---

## Structuur

```
praktijkles1/
├── instructies.md         ← dit bestand
└── src/
    ├── task_manager.py     ← hier schrijft de agent zijn oplossing
    ├── test_task_manager.py ← testcode
    └── run_tests.sh        ← harness om tests te draaien
```