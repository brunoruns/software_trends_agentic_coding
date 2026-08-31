/**
 * 🧠 Agentic Coding Demo
 * 
 * Toont hoe een AI-agent autonoom codeert:
 * - Zelfstandig probleemanalyse
 * - Bestanden lezen/schrijven
 * - Planning en uitvoering
 * - Meerdere stappen coördineren
 * - Testen en valideren van eigen code
 */

// ============================================================
// 1. AUTONOME TASK: De agent krijgt een doel en werkt zelfstandig
// ============================================================

/**
 * 🎯 OPDRACHT AAN DE AGENT:
 * "Maak een function die een CSV-string parset en er
 *  statistieken uit berekent: totaal, gemiddelde, min, max
 *  per kolom. Schrijf ook unit tests."
 *
 * De agent analyseert, plant en voert uit zonder prompt-chaining.
 */

// === Agent voert analyse uit: ===
// 1. Begrijpt CSV-formaat (komma-gescheiden, header-rij)
// 2. Bepaalt dat numerieke kolommen statistieken nodig hebben
// 3. Plant de implementatie: parseHeaders → parseRows → computeStats
// 4. Voert de code uit
// 5. Genereert tests

// === RESULTAAT van de agent ===

/**
 * Parseert een CSV-string en berekent statistieken per kolom
 * @param {string} csvData - De CSV-data met header-rij
 * @returns {{ headers: string[], stats: object, rows: object[] }}
 */
function analyzeCSV(csvData) {
  // Stap 1: Split in regels en verwijder lege regels
  const lines = csvData.trim().split('\n').filter((line) => line.trim());

  if (lines.length < 2) {
    throw new Error('CSV moet minstens een header en 1 datarij bevatten');
  }

  // Stap 2: Parse headers
  const headers = lines[0].split(',').map((h) => h.trim());

  // Stap 3: Parse datarijen
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = isNaN(Number(values[idx])) ? values[idx] : Number(values[idx]);
    });
    return row;
  });
// Stap 4: Bereken statistieken per kolom
  const stats = {};
  headers.forEach((header) => {
    const values = rows.map((row) => row[header]).filter((v) => typeof v === 'number');
    if (values.length > 0) {
      stats[header] = {
        total: values.reduce((sum, v) => sum + v, 0),
        average: +(values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2),
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    } else {
      stats[header] = {
        type: 'string',
        count: rows.length,
        uniqueValues: [...new Set(rows.map((r) => r[header]))],
      };
    }
  });

  return { headers, rows, stats };
}

// === Agent test zijn eigen code ===
const testCSV = `naam,leeftijd,score,talen
Jan,28,8.5,JavaScript
Maria,32,9.2,Python
Klaas,25,7.8,Java
Sofie,30,9.5,TypeScript`;

const result = analyzeCSV(testCSV);
console.log('📊 CSV Analyse Resultaat:');
console.log('Headers:', result.headers);
console.log('Statistieken:');
console.log('  leeftijd:', result.stats.leeftijd);
console.log('  score:', result.stats.score);
console.log('  talen:', result.stats.talen);

// ============================================================
// 2. MULTI-STEP TASK: Agent coördineert meerdere stappen
// ============================================================

/**
 * 🎯 OPDRACHT:
 * "Lees alle .md files in de /docs map, zoek naar TODO's,
 *  groepeer ze per file, en schrijf een rapport."
 *
 * De agent:
 *   1. Leest directory-inhoud
 *   2. Filtert op .md bestanden
 *   3. Leest elke file
 *   4. Zoekt TODO-patroon met regex
 *   5. Genereert rapport
 */

async function findTodosInDirectory(directoryPath) {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    // Stap 1: Lees directory
    const files = await fs.readdir(directoryPath);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    // Stap 2: Lees elke .md file en zoek TODO's
    const todos = {};

    for (const file of mdFiles) {
      const filePath = path.join(directoryPath, file);
      const content = await fs.readFile(filePath, 'utf-8');

      // Stap 3: Regex om TODO's te vinden
      const todoRegex = /(?:TODO|FIXME|HACK|XXX):?\s*(.*)/gi;
      const matches = [];
      let match;

      while ((match = todoRegex.exec(content)) !== null) {
        matches.push({
          line: content.substring(0, match.index).split('\n').length,
          text: match[1].trim(),
          priority: match[0].startsWith('FIXME') ? 'hoog' : 'normaal',
        });
      }

      if (matches.length > 0) {
        todos[file] = matches;
      }
    }

    // Stap 4: Genereer rapport
    const totalTodos = Object.values(todos).flat().length;
    const highPriority = Object.values(todos)
      .flat()
      .filter((t) => t.priority === 'hoog').length;

    return {
      summary: {
        totalFiles: mdFiles.length,
        filesWithTodos: Object.keys(todos).length,
        totalTodos,
        highPriorityTodos: highPriority,
      },
      details: todos,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    return { error: `Fout bij verwerken: ${error.message}` };
  }
}

// ============================================================
// 3. SELF-HEALING CODE: Agent detecteert en herstelt fouten
// ============================================================

/**
 * 🎯 OPDRACHT:
 * "Maak een API-call met retry-logica die zichzelf herstelt
 *  bij netwerkfouten."
 */

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(5000), // 5s timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`💥 Alle ${maxRetries} pogingen mislukt:`, error.message);
        throw error;
      }

      // Exponentiële backoff: wacht 1s, 2s, 4s, ...
      const waitMs = Math.pow(2, attempt - 1) * 1000;
      console.log(`⏳ Poging ${attempt} mislukt. Opnieuw proberen over ${waitMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
}

// ============================================================
// 4. AGENT-ORCHESTRATIE: Meerdere agenten werken samen
// ============================================================

/**
 * Een orchestrator-agent die subtaken uitbesteedt aan
 * gespecialiseerde agenten:
 *
 * ┌──────────────────────────────────────────┐
 * │         Orchestrator Agent               │
 * │  "Genereer een rapport over verkoopdata" │
 * └──────────┬──────────────────┬────────────┘
 *            │                  │
 *     ┌──────▼──────┐    ┌─────▼──────┐
 *     │ Data Agent   │    │ Report     │
 *     │ (parseert    │    │ Agent      │
 *     │  en verrijkt)│    │ (genereert │
 *     └──────────────┘    │  HTML)     │
 *                          └────────────┘
 */

async function orchestratorDemo() {
  // Data Agent: parseert en verrijkt data
  const data = analyzeCSV(testCSV);

  // Report Agent: genereert rapport op basis van data
  const report = {
    title: 'Verkooprapport Q3 2026',
    generatedAt: new Date().toLocaleString('nl-BE'),
    totalRecords: data.rows.length,
    gemiddeldeScore: data.stats.score?.average ?? 0,
    hoogsteScore: data.stats.score?.max ?? 0,
    // Agent bepaalt zelf of er outliers zijn
    outliers: data.rows.filter(
      (r) => r.score > data.stats.score.average * 1.2 || r.score < data.stats.score.average * 0.8
    ),
  };

  console.log('\n📋 Orchestrator Rapport:');
  console.log(JSON.stringify(report, null, 2));
  return report;
}

orchestratorDemo().catch(console.error);

export { analyzeCSV, findTodosInDirectory, fetchWithRetry };