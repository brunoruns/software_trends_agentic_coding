/**
 * 🔮 Autocomplete Demo
 * 
 * Toont hoe intelligente code completion (IntelliSense) werkt:
 * - Method completion met parameters
 * - Property completion
 * - Snippet suggesties
 * - Type-inferentie
 * - JSDoc documentatie-hints
 */

// ============================================================
// 1. METHOD COMPLETION — typ "user." en zie alle beschikbare methodes
// ============================================================
const user = {
  id: 1,
  name: 'Jan Janssens',
  email: 'jan@example.com',
  role: 'developer',
  skills: ['JavaScript', 'React', 'Node.js'],

  /**
   * Formateert de naam van de gebruiker
   * @param {string} prefix - Aanspreektitel (bv. "Dr.", "Ing.")
   * @returns {string} De volledige naam met prefix
   */
  getFullName(prefix = '') {
    return prefix ? `${prefix} ${this.name}` : this.name;
  },

  /**
   * Controleert of de gebruiker een bepaalde skill heeft
   * @param {string} skill - Naam van de skill
   * @returns {boolean}
   */
  hasSkill(skill) {
    return this.skills.includes(skill);
  },

  /**
   * Genereert een e-mailhandtekening
   * @returns {string}
   */
  getSignature() {
    return `Met vriendelijke groeten,\n${this.name}\n${this.email}`;
  },
};

// ════════════════════════════════════════════════════════════
// Probeer: typ "user." — IntelliSense toont getFullName, hasSkill, getSignature
// Probeer: typ "user.getFullName(" — toont parameter-hint met @param
// ════════════════════════════════════════════════════════════
console.log(user.getFullName('Ing.'));
console.log(user.hasSkill('React'));

// ============================================================
// 2. IMPORT COMPLETION — typ importeren van bestaande functies
// ============================================================
// Druk Ctrl+Space om suggesties te zien voor bestaande imports
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';

// ============================================================
// 3. SNIPPET EXPANSIE — typ "log" + Enter voor console.log
// ============================================================
console.log('Typ "log" en druk Tab — dit is een snippet!');

// Typ "for" + Tab voor for-loop snippet
for (let i = 0; i < 10; i++) {
  console.log(`Iteratie ${i}`);
}

// ============================================================
// 4. TYPE-INFERENTIE — autocompletion begrijpt het type
// ============================================================
const scores = [85, 92, 78, 94, 88];
// scores. — toont Array-methodes: map, filter, reduce, find, etc.
const highScores = scores.filter((score) => score > 80);
console.log('High scores:', highScores);

// ============================================================
// 5. PROPERTY COMPLETION — destructuring met hints
// ============================================================
function processUser({ id, name, email, role }) {
  // Typ "id." — toont number-methodes (toString, toFixed, etc.)
  // Typ "name." — toont string-methodes (toUpperCase, trim, etc.)
  console.log(`Verwerk ${name} (${id}) als ${role}`);
}

processUser(user);

export { user };