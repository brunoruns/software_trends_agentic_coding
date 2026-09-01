# Fase 3 — Iteratieve fix-loop

Als de tests in Fase 2 niet allemaal groen zijn, laat je de agent itereren in een **fix-loop**.

---

## Prompt (NL, voor Cline)

```
De tests in src/test_url_shortener.py falen nog.

Lees de test output hieronder:
[PLAK UITVOER VAN pytest]

Analyseer welke tests falen en waarom.
Pas de code in src/url_shortener.py aan zodat deze tests slagen.
Voer daarna opnieuw python -m pytest src/test_url_shortener.py -v uit.

Herhaal: analyseer → pas aan → test → analyseer → pas aan → test
Stop pas als ALLE tests groen zijn.

Belangrijk:
- Lees de foutmeldingen zorgvuldig
- Begrijp wat de test verwacht
- Wijzig alleen de implementatie, niet de tests
- Als je vastloopt, overweeg of de test logica of de implementatie logica het probleem is
```

---

## Automatische harness (run_tests.sh)

Voor een volledig geautomatiseerde loop kun je de **harness** gebruiken:

```bash
# src/run_tests.sh — voer dit uit in de terminal
while true; do
    echo "========================================"
    echo "Tests uitvoeren..."
    echo "========================================"
    
    python -m pytest src/test_url_shortener.py -v 2>&1
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo ""
        echo "🎉 ALLE TESTS GROEN! Gefeliciteerd!"
        break
    fi
    
    echo ""
    echo "❌ Tests falen (exit code: $EXIT_CODE)"
    echo "📝 Vraag de agent om de code te fixen..."
    echo ""
    
    # Wacht tot de agent klaar is met aanpassen
    read -p "Druk op Enter nadat de agent klaar is met fixen..."
done
```

---

## Tip voor de agent

Als je een specifieke fout ziet, kun je ook een gerichte prompt geven:

```
Deze test faalt: test_retrieve_url_expired

Wat de test doet: 
1. shorten_url("https://example.com", expiration_hours=0.0001)
2. wacht 0.1 seconden
3. retrieve_url(code) — verwacht None

Wat er nu gebeurt: [beschrijf de fout]

Fix de implementatie zodat deze test slaagt.
```