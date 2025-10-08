import express from "express";
const app = express();

app.use(express.static("public"));

app.get("/welcome", (req, res) => {
  const name = req.query.name || "gast";
  res.json({ message: `Hallo ${name}, welkom op onze website!` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});