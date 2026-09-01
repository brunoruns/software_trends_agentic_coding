"""
URL Shortener API — Reference Implementation

Dit is een voorbeeld-implementatie van de URL Shortener.
Studenten laten de AI-agent deze code genereren.
"""

import time
import hashlib


# In-memory storage: { short_code: { "url": str, "created_at": float } }
_store = {}


def _generate_code(url: str) -> str:
    """Genereer een korte unieke code op basis van de URL."""
    return hashlib.md5(url.encode()).hexdigest()[:8]


def shorten_url(url: str, expiration_hours: int = 24) -> str:
    """
    Verkort een lange URL.

    Args:
        url: De lange URL om te verkorten.
        expiration_hours: Aantal uur tot de URL verloopt (default: 24).

    Returns:
        Een korte unieke code.
    """
    code = _generate_code(url)
    _store[code] = {
        "url": url,
        "created_at": time.time(),
        "expiration_hours": expiration_hours,
    }
    return code


def retrieve_url(code: str) -> str | None:
    """
    Haal de originele URL op via een korte code.

    Args:
        code: De korte code.

    Returns:
        De originele URL, of None als de code niet bestaat of verlopen is.
    """
    entry = _store.get(code)
    if entry is None:
        return None

    # Check expiration
    elapsed = time.time() - entry["created_at"]
    max_age = entry["expiration_hours"] * 3600  # uren → seconden
    if elapsed >= max_age:
        # Opruimen (optioneel)
        del _store[code]
        return None

    return entry["url"]


def clear_store():
    """Reset de opslag (handig voor testen)."""
    _store.clear()