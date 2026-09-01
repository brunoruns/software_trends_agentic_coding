# Fase 2 — Implementatie op basis van tests

Kopieer onderstaande prompt in Cline's chat. De agent mag nu **alleen de implementatie** schrijven om de tests groen te maken.

---

## Prompt (NL)

```
De tests staan in src/test_url_shortener.py.

Lees de tests en implementeer de code in src/url_shortener.py
zodat alle tests slagen.

De API moet deze functies hebben:

1. shorten_url(url: str, expiration_hours: int = 24) -> str
   - Genereer een unieke korte code voor de URL
   - Sla de URL op met een timestamp
   - Retourneer de code

2. retrieve_url(code: str) -> str | None
   - Zoek de code op
   - Check of de URL nog niet verlopen is
   - Retourneer de originele URL of None

Gebruik alleen standaard Python libraries.
Bewaar data in een Python dictionary (in-memory).
Gebruik time.time() voor timestamps.

De functies moeten precies overeenkomen met wat de tests verwachten.
Voer python -m pytest src/test_url_shortener.py -v uit om te checken.
```

---

## Prompt (EN, alternatief)

```
The tests are in src/test_url_shortener.py.

Read the tests and implement the code in src/url_shortener.py
so that all tests pass.

Use only standard Python libraries.
Use in-memory storage (Python dict).

Run python -m pytest src/test_url_shortener.py -v to verify.
```

---

## Na deze fase

Voer `python -m pytest src/test_url_shortener.py -v` uit. Als alles groen is: ✅
Als er nog rode tests zijn: ga naar Fase 3.