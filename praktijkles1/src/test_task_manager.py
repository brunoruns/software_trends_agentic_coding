#!/usr/bin/env python3
"""
Tests voor de Task Manager CLI.

Deze tests worden aangeroepen door run_tests.sh en controleren of
de CLI correct werkt volgens de requirements:
- create task (add)
- list task   (list)
- mark done   (done)
"""

import subprocess
import tempfile
import os
import json
import sys
import unittest


class TestTaskManager(unittest.TestCase):
    """Test de CLI door subprocess-aanroepen."""

    def setUp(self):
        """Maak een tijdelijke werkmap zodat tests elkaar niet beïnvloeden."""
        self.tmpdir = tempfile.TemporaryDirectory()
        self.original_cwd = os.getcwd()
        os.chdir(self.tmpdir.name)
        self.script = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "task_manager.py"
        )

    def tearDown(self):
        os.chdir(self.original_cwd)
        self.tmpdir.cleanup()

    def _run(self, *args):
        """Voer task_manager.py uit met de gegeven argumenten."""
        return subprocess.run(
            [sys.executable, self.script] + list(args),
            capture_output=True,
            text=True,
        )

    # ── Tests ──────────────────────────────────────────────────────

    def test_add_task(self):
        """Een taak toevoegen moet slagen en een bevestiging geven."""
        result = self._run("add", "Mijn eerste taak")
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        self.assertIn("Mijn eerste taak", result.stdout)

    def test_list_empty(self):
        """Zonder taken moet list een lege lijst tonen."""
        result = self._run("list")
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        # Geen foutmelding, lege output is ok
        self.assertNotIn("Error", result.stdout)

    def test_add_and_list(self):
        """Na toevoegen moet de taak in list verschijnen."""
        self._run("add", "Test taak")
        result = self._run("list")
        self.assertEqual(result.returncode, 0)
        self.assertIn("Test taak", result.stdout)

    def test_list_multiple_tasks(self):
        """Meerdere taken toevoegen en controleren of ze allemaal verschijnen."""
        self._run("add", "Eerste")
        self._run("add", "Tweede")
        self._run("add", "Derde")
        result = self._run("list")
        self.assertIn("Eerste", result.stdout)
        self.assertIn("Tweede", result.stdout)
        self.assertIn("Derde", result.stdout)

    def test_done_marks_completed(self):
        """Een taak als done markeren moet zichtbaar zijn in list."""
        self._run("add", "Af te ronden taak")
        result = self._run("list")
        self.assertIn("Af te ronden taak", result.stdout)
        # Markeer als done (id 1)
        self._run("done", "1")
        result_after = self._run("list")
        # De taak moet nu als done worden getoond
        self.assertIn("done", result_after.stdout.lower())
        self.assertIn("Af te ronden taak", result_after.stdout)

    def test_done_invalid_id(self):
        """Done met een niet-bestaand ID geeft een duidelijke fout."""
        result = self._run("done", "999")
        self.assertNotEqual(result.returncode, 0)
        # OF: returncode 0 maar met foutmelding in stdout/stderr
        output = (result.stdout + result.stderr).lower()
        self.assertIn("niet", output)

    def test_add_empty_description(self):
        """Een lege beschrijving moet worden afgevangen."""
        result = self._run("add", "")
        output = (result.stdout + result.stderr).lower()
        # Of hij faalt of een waarschuwing geeft is ok
        # maar het mag geen index-error of traceback zijn
        self.assertNotIn("traceback", output)

    def test_persistence(self):
        """Taken moeten blijven bestaan na een herstart van de CLI."""
        self._run("add", "Blijvende taak")
        # Simuleer herstart: roep list opnieuw aan
        result = self._run("list")
        self.assertIn("Blijvende taak", result.stdout)

    def test_json_file_exists(self):
        """Het data-bestand (tasks.json) moet worden aangemaakt."""
        self._run("add", "Test")
        self.assertTrue(
            os.path.exists("tasks.json"),
            "tasks.json moet bestaan na het toevoegen van een taak"
        )

    def test_json_format(self):
        """tasks.json moet geldige JSON bevatten."""
        self._run("add", "Format test")
        with open("tasks.json") as f:
            data = json.load(f)
        self.assertIsInstance(data, list, "tasks.json moet een lijst zijn")
        self.assertGreater(len(data), 0)


if __name__ == "__main__":
    unittest.main()