#!/usr/bin/env bash
#
# run_tests.sh — Harness voor de TDD Agent Loop
#
# Dit script voert de tests uit in een oneindige loop.
# Zolang tests falen, pauzeert het zodat de agent kan fixen.
# Zodra alle tests groen zijn, stopt het met een succesmelding.
#
# Gebruik:
#   1. Start de agent met de Fase 3 prompt
#   2. Voer dit script uit in een aparte terminal
#   3. Elke keer dat de agent klaar is met fixen, druk op Enter
#   4. Herhaal tot alle tests groen zijn
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================"
echo " 🔄 URL Shortener — TDD Agent Harness"
echo "========================================"
echo ""

ITERATION=0

while true; do
    ITERATION=$((ITERATION + 1))
    echo "========================================"
    echo " Iteratie #$ITERATION — Tests uitvoeren..."
    echo "========================================"

    if python -m pytest test_url_shortener.py -v 2>&1; then
        echo ""
        echo "🎉  ALLE TESTS GROEN! Gefeliciteerd!"
        echo "    Aantal iteraties: $ITERATION"
        echo ""
        break
    fi

    echo ""
    echo "❌ Tests falen (iteratie #$ITERATION)"
    echo "📝 Laat de agent de code fixen..."
    echo ""

    # Wacht tot de agent klaar is met aanpassen
    # (docent/student bevestigt handmatig)
    read -p "   Druk op Enter nadat de agent de fix heeft toegepast..."
    echo ""
done