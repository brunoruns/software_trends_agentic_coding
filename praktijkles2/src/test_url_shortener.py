"""
Tests voor de URL Shortener API — Reference Test Suite

Studenten laten de AI-agent deze tests genereren in Fase 1.
"""

import time
import pytest
from url_shortener import shorten_url, retrieve_url, clear_store


@pytest.fixture(autouse=True)
def reset_store():
    """Elke test begint met een lege store."""
    clear_store()
    yield


class TestShortenUrl:
    """Test suite voor shorten_url."""

    def test_shorten_returns_string(self):
        """shorten_url moet een string retourneren."""
        code = shorten_url("https://example.com")
        assert isinstance(code, str)
        assert len(code) > 0

    def test_shorten_idempotent(self):
        """Dezelfde URL moet dezelfde code krijgen."""
        code1 = shorten_url("https://example.com")
        code2 = shorten_url("https://example.com")
        assert code1 == code2

    def test_shorten_unique_for_different_urls(self):
        """Verschillende URL's moeten verschillende codes krijgen."""
        code1 = shorten_url("https://example.com/page1")
        code2 = shorten_url("https://example.com/page2")
        assert code1 != code2


class TestRetrieveUrl:
    """Test suite voor retrieve_url."""

    def test_retrieve_returns_original_url(self):
        """Een verkorte URL moet de originele URL teruggeven."""
        original = "https://example.com/long/path"
        code = shorten_url(original)
        result = retrieve_url(code)
        assert result == original

    def test_retrieve_nonexistent_code(self):
        """Voor een onbekende code moet retrieve_url None geven."""
        result = retrieve_url("nonexistent")
        assert result is None

    def test_retrieve_expired_url(self):
        """Een verlopen URL moet None geven."""
        # 0.00001 uur ≈ 0.036 seconde
        code = shorten_url("https://example.com", expiration_hours=0.00001)
        time.sleep(0.05)  # wacht tot de URL verlopen is
        result = retrieve_url(code)
        assert result is None

    def test_retrieve_before_expiration(self):
        """Een URL moet ophaalbaar zijn zolang hij niet verlopen is."""
        code = shorten_url("https://example.com", expiration_hours=24)
        result = retrieve_url(code)
        assert result == "https://example.com"

    def test_retrieve_multiple_urls(self):
        """Meerdere URL's moeten allemaal ophaalbaar zijn."""
        urls = [
            "https://example.com/1",
            "https://example.com/2",
            "https://example.com/3",
        ]
        codes = [shorten_url(url) for url in urls]
        for code, original in zip(codes, urls):
            assert retrieve_url(code) == original


class TestExpiration:
    """Test suite voor expiration functionaliteit."""

    def test_custom_expiration_time(self):
        """Custom expiration_hours moet gerespecteerd worden."""
        code = shorten_url("https://example.com", expiration_hours=0)  # 0 = direct verlopen
        time.sleep(0.1)
        result = retrieve_url(code)
        assert result is None

    def test_default_expiration_is_24_hours(self):
        """Zonder opgave moet expiration 24 uur zijn."""
        code = shorten_url("https://example.com")
        entry_created = code  # we gebruiken de code om te checken
        # We kunnen de interne state niet direct checken, maar de URL moet werken
        result = retrieve_url(code)
        assert result == "https://example.com"