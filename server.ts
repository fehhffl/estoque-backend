const express = require("express");
import { Request, Response } from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
const app = express();
dotenv.config();

// Rota inicial
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

// Configurando porta
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor servidor em http://localhost:${PORT}`);
});
