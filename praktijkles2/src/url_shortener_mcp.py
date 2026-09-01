from mcp.server.mcpserver import MCPServer
from url_shortener import shorten_url as _shorten, retrieve_url as _retrieve, _store

# Creëer de MCP-server (MCPServer is de v2.x opvolger van FastMCP)
mcp = MCPServer("URL Shortener")


@mcp.tool()
def shorten_url(url: str, expiration_hours: int = 24) -> str:
    """
    Verkort een lange URL tot een korte unieke code.

    Args:
        url: De lange URL om te verkorten.
        expiration_hours: Na hoeveel uur de URL verloopt (default: 24).

    Returns:
        Een korte unieke code waarmee de URL later teruggevonden kan worden.
    """
    return _shorten(url, expiration_hours)


@mcp.tool()
def retrieve_url(code: str) -> str | None:
    """
    Haal de originele URL op via een korte code.

    Args:
        code: De korte code die door shorten_url gegenereerd is.

    Returns:
        De originele URL, of None als de code niet bestaat of verlopen is.
    """
    return _retrieve(code)


@mcp.resource("url-shortener://stats")
def get_stats() -> str:
    """
    Geeft statistieken over de URL Shortener.
    """
    import time
    now = time.time()
    active = 0
    for entry in _store.values():
        max_age = entry["expiration_hours"] * 3600
        if now - entry["created_at"] < max_age:
            active += 1
    return f"Totaal opgeslagen: {len(_store)}, actief: {active}"


if __name__ == "__main__":
    mcp.run(transport="stdio")