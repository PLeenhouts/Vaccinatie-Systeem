const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/Front_end.html');
});

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});