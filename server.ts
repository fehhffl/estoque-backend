import { Request, Response } from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

const express = require("express");
const app = express();
app.use(express.json());
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/products", async (req: Request, res: Response) => {
  const [rows] = await db.execute("SELECT * FROM PRODUCTS");
  res.status(200).json(rows);
});

app.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10); // 10 = numero de vezes que o hash sera aplicado na potencia 2.
  await db.execute(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, encryptedPassword]
  );
  res.status(204).send();
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor servidor em http://localhost:${PORT}`);
});
