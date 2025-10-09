const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const bestandPad = path.join(__dirname, 'namen.json');
const afsprakenPad = path.join(__dirname, 'afspraken.json');

// Zorg dat de bestanden bestaan
if (!fs.existsSync(bestandPad)) {
  fs.writeFileSync(bestandPad, JSON.stringify([]));
}
if (!fs.existsSync(afsprakenPad)) {
  fs.writeFileSync(afsprakenPad, JSON.stringify([]));
}

// POST: naam opslaan
app.post('/groet', (req, res) => {
  const { naam } = req.body;
  if (!naam) return res.status(400).json({ groet: 'Naam ontbreekt.' });

  const namen = JSON.parse(fs.readFileSync(bestandPad));
  namen.push(naam);
  fs.writeFileSync(bestandPad, JSON.stringify(namen, null, 2));

  res.json({ groet: `Hallo ${naam}, je naam is opgeslagen!` });
});

// POST: afspraak opslaan
app.post('/afspraak', (req, res) => {
  const { naam, datum, tijd } = req.body;
  if (!naam || !datum || !tijd) {
    return res.status(400).json({ groet: 'Naam, datum of tijd ontbreekt.' });
  }

  const afspraken = JSON.parse(fs.readFileSync(afsprakenPad));
  afspraken.push({ naam, datum, tijd });
  fs.writeFileSync(afsprakenPad, JSON.stringify(afspraken, null, 2));

  res.json({ groet: `Afspraak voor ${naam} op ${datum} om ${tijd} is opgeslagen!` });
});

// GET: alle afspraken ophalen (zonder wachtwoord)
app.get('/afspraken', (req, res) => {
  try {
    const afspraken = JSON.parse(fs.readFileSync(afsprakenPad, 'utf8'));
    res.json({ afspraken });
  } catch (err) {
    console.error('Fout bij lezen afspraken:', err.message);
    res.status(500).json({ afspraken: [], error: 'Kon afspraken niet lezen.' });
  }
});

// GET: alle namen ophalen
app.get('/namen', (req, res) => {
  try {
    const namen = JSON.parse(fs.readFileSync(bestandPad));
    res.json({ namen });
  } catch (err) {
    console.error('Fout bij lezen namen:', err.message);
    res.status(500).json({ namen: [], error: 'Kon namen niet lezen.' });
  }
});

// Root-route voor duidelijkheid
app.get('/', (req, res) => {
  res.send('<h1>Welkom bij de demo-server!</h1><p>Gebruik POST naar <code>/groet</code> of <code>/afspraak</code>.</p>');
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});

