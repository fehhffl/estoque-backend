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
  try {
    const [rows] = await db.execute("SELECT * FROM PRODUCTS");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Falha ao retornar produtos." });
  }
});

app.post("/login");

app.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email ou senha estao vazios" });
  }

  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (Array.isArray(rows) && rows.length > 0) {
    return res
      .status(409)
      .json({ message: "Email já esta cadastrado a uma conta." }); // 409 = conflict
  }
  try {
    const encryptedPassword = await bcrypt.hash(password, 10); // 10 = numero de vezes que o hash sera aplicado na potencia 2.

    await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, encryptedPassword]
    );

    res.status(204).send();
  } catch (error) {
    console.error("error creating user.", error);
    res.status(500).json({ message: "Erro ao criar usuario." });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor servidor em http://localhost:${PORT}`);
});
