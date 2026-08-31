#!/usr/bin/env bash
# ───────────────────────────────────────────────────────
# run_tests.sh — Harness voor de Task Manager CLI
#
# Dit script:
#   1. Draait de unit tests voor task_manager.py
#   2. Toont een duidelijke samenvatting van geslaagde/gefaalde tests
#   3. Geeft exit code 0 als alle tests slagen, anders 1
#
# Gebruik:
#   ./src/run_tests.sh
#
# De agent kan dit script zelf aanroepen om feedback te krijgen:
#   → tests falen → code fixen → opnieuw testen
# ───────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "╔═══════════════════════════════════════════════╗"
echo "║  Task Manager CLI — Test Runner               ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Ctrl+C afvangen zodat we altijd opruimen
cleanup() {
    rm -f tasks.json
    echo ""
    echo "Opgeruimd: tasks.json verwijderd."
}
trap cleanup EXIT

# Zorg dat er geen resten van vorige runs liggen
rm -f tasks.json

# Tests uitvoeren met verbose output
python3 -m unittest test_task_manager.py -v

EXIT_CODE=$?
echo ""

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Alle tests geslaagd!"
else
    echo "❌ Sommige tests gefaald. Pas de code aan en draai dit script opnieuw."
fi

exit $EXIT_CODE