const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/groet', (req, res) => {
  const { naam } = req.body;
  const groet = `Hallo ${naam}, welkom op de server!`;
  res.json({ groet });
});

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});

