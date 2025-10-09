const express = require('express');
const app = express();
const port = 3000;

// Middleware om JSON te kunnen verwerken
app.use(express.json());

// Basisroute
app.get('/', (req, res) => {
  res.send('Hallo wereld! De server draait op poort 3000.');
});

// Voorbeeld van een POST-endpoint
app.post('/data', (req, res) => {
  const ontvangenData = req.body;
  res.json({ bericht: 'Data ontvangen', ontvangenData });
});

// Server starten
app.listen(port, () => {
  console.log(`Server actief op http://localhost:${port}`);
});
