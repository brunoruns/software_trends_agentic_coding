/**
 * 🤖 Copilot Demo
 * 
 * Toont hoe GitHub Copilot (AI pair programmer) werkt:
 * - Context-aware code generation
 * - Natuurlijke taal → code
 * - Comment-aangedreven suggesties
 * - Boilerplate generatie
 * - Test generatie
 */

// ============================================================
// 1. NATUURLIJKE TAAL → CODE
// Schrijf een beschrijvend comment: Copilot genereert de implementatie
// ============================================================

// Functie die controleert of een wachtwoord sterk genoeg is
// (minstens 8 karakters, 1 hoofdletter, 1 cijfer, 1 speciaal teken)
function isStrongPassword(password) {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
}

// Test de functie — typ "isStrongPassword(" en Copilot vult suggestie aan
console.log(isStrongPassword('Zwak'));               // false
console.log(isStrongPassword('Sterk!1Wachtwoord')); // true

// ============================================================
// 2. BOILERPLATE GENERATIE
// Typ een herkenbaar patroon — Copilot vult de rest aan
// ============================================================

// Express API endpoint met CRUD-operaties voor "products"
const express = require('express');
const app = express();
app.use(express.json());

let products = [
  { id: 1, name: 'Laptop', price: 999, inStock: true },
  { id: 2, name: 'Monitor', price: 299, inStock: false },
];

// GET /products — lijst alle producten
app.get('/products', (req, res) => {
  res.json(products);
});

// GET /products/:id — zoek één product
app.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product niet gevonden' });
  res.json(product);
});

// POST /products — voeg nieuw product toe
app.post('/products', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    inStock: req.body.inStock ?? true,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// ============================================================
// 3. CONTEXT-AWARE SUGGESTIES
// Copilot herkent patronen en vult logische vervolgen aan
// ============================================================

// Data-transformatie: pijplijn van array-operaties
// Typ "const result = data." — Copilot stelt filter/map/reduce voor
const data = [10, 20, 30, 40, 50, 60, 70];

// Copilot begrijpt dat we willen filteren > gemiddelde
const average = data.reduce((sum, val) => sum + val, 0) / data.length;
const aboveAverage = data.filter((val) => val > average);
console.log('Boven gemiddelde:', aboveAverage);

// ============================================================
// 4. TEST GENERATIE
// Typ "describe(" en Copilot genereert Jest-teststructuur
// ============================================================

describe('isStrongPassword', () => {
  test('verwerpt een te kort wachtwoord', () => {
    expect(isStrongPassword('Kort1!')).toBe(false);
  });

  test('verwerpt wachtwoord zonder hoofdletter', () => {
    expect(isStrongPassword('zwak123!')).toBe(false);
  });

  test('verwerpt wachtwoord zonder cijfer', () => {
    expect(isStrongPassword('Hoofdletters!')).toBe(false);
  });

  test('verwerpt wachtwoord zonder speciaal teken', () => {
    expect(isStrongPassword('Hoofd1etter')).toBe(false);
  });

  test('accepteert een sterk wachtwoord', () => {
    expect(isStrongPassword('Str0ng!Pass')).toBe(true);
  });
});

// ============================================================
// 5. REGEX GENERATIE
// Beschrijf wat je nodig hebt — Copilot schrijft de regex
// ============================================================

// Regex om een Belgisch rijksregisternummer te valideren (formaat: 99.99.99-999.99)
const rijksregNrRegex = /^\d{2}\.\d{2}\.\d{2}-\d{3}\.\d{2}$/;
console.log(rijksregNrRegex.test('93.05.21-123.45')); // true

module.exports = { isStrongPassword, products };