const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new Pool({
  user: "taskflow_user",
  host: "localhost",
  database: "taskflow",
  password: "TaskFlow123!",
  port: 5432
});

app.get("/", (req, res) => {
  res.send("TaskFlow API is running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "taskflow-api"
  });
});

app.get("/tasks", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks ORDER BY id");
  res.json(result.rows);
});

app.post("/tasks", async (req, res) => {
  const { title } = req.body;

  const result = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    [title]
  );

  res.status(201).json(result.rows[0]);
});

app.listen(PORT, () => {
  console.log(`TaskFlow API listening on port ${PORT}`);
});
