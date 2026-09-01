# Fase 1 — Alleen tests schrijven

Kopieer onderstaande prompt in Cline's chat. De agent mag **alleen tests schrijven**, nog geen implementatie.

---

## Prompt (NL)

```
Je gaat een URL Shortener API bouwen in Python. 

Schrijf nu **alleen de tests**. Geen implementatie.

De API heeft deze functies:

1. shorten_url(url: str) -> str
   - Krijgt een lange URL
   - Geeft een korte unieke code terug (bv. "abc123")
   
2. retrieve_url(code: str) -> str | None
   - Krijgt een korte code
   - Geeft de originele URL terug
   - Geeft None als de code niet bestaat of verlopen is

3. Expiration
   - Elke verkorte URL heeft een vervaldatum (default: 24 uur)
   - retrieve_url() retourneert None voor verlopen URL's
   - Optioneel: ondersteun een custom expiration time

Gebruik standaard Python libraries (geen Flask, FastAPI, etc.).
Gebruik pytest of unittest.

Test de volgende scenario's:
- Een URL shorten en daarna ophalen werkt
- retrieve_url geeft None voor een onbekende code
- retrieve_url geeft None voor een verlopen URL
- shorten_url genereert unieke codes voor verschillende URL's
- shorten_url genereert dezelfde code voor dezelfde URL (idempotent)
- Custom expiration time wordt gerespecteerd

Schrijf de tests in src/test_url_shortener.py.
Implementatie komt in src/url_shortener.py (laat dit leeg voor nu).
```

---

## Prompt (EN, alternatief)

```
You are building a URL Shortener API in Python.
Write **only the tests** — no implementation yet.

The API has these functions:

1. shorten_url(url: str) -> str
2. retrieve_url(code: str) -> str | None
3. Expiration (default: 24 hours)

Use only standard Python libraries.
Use pytest or unittest.

Write the tests in src/test_url_shortener.py.
Leave src/url_shortener.py empty for now.
```

---

## Na deze fase

Controleer of de tests geschreven zijn en slaag er een `python -m pytest src/test_url_shortener.py -v` uit te voeren (ze moeten **falen** — dat is RED! ✅).