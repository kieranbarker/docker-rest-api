const express = require("express");
const db = require("better-sqlite3")("cupcakes.db");

db.exec(`CREATE TABLE IF NOT EXISTS cupcakes (
  id INTEGER PRIMARY KEY,
  flavour TEXT NOT NULL,
  instructions TEXT NOT NULL
);`);

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method + " " + req.path);
  next();
});

app.get("/cupcakes", async (req, res) => {
  const cupcakes = db.prepare("SELECT * FROM cupcakes").all();
  res.status(200).json(cupcakes);
});

app.get("/cupcakes/:id", async (req, res) => {
  const cupcake = db
    .prepare("SELECT * FROM cupcakes WHERE id = ?")
    .get(req.params.id);

  if (!cupcake) {
    res.status(404).json({ error: "Cupcake not found" });
    return;
  }

  res.status(200).json(cupcake);
});

app.post("/cupcakes", async (req, res) => {
  if (!req.body.flavour || !req.body.instructions) {
    res.status(400).json({ error: "Missing 'flavour' and/or 'instructions'" });
    return;
  }

  const { lastInsertRowid } = db
    .prepare("INSERT INTO cupcakes (flavour, instructions) VALUES (?, ?)")
    .run(req.body.flavour, req.body.instructions);

  const cupcake = db
    .prepare("SELECT * FROM cupcakes WHERE id = ?")
    .get(lastInsertRowid);

  res.status(201).json(cupcake);
});

const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
