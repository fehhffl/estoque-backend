import { Request, Response } from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "./models/user";

const express = require("express");
const app = express();
app.use(express.json({ limit: "10mb" })); // Aumenta o tamanho do payload máximo para aguentar as imagens
app.use(express.urlencoded({ limit: "10mb", extended: true }));
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, description, value, quantity FROM products"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Falha ao retornar produtos." });
  }
});

app.put("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, value, quantity } = req.body;

  if (!name || !description || value === undefined || quantity === undefined) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    await db.execute(
      "UPDATE products SET name = ?, description = ?, value = ?, quantity = ? WHERE id = ?",
      [name, description, value, quantity, id]
    );
    res.status(200).json({ message: "Produto atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ message: JSON.stringify(error, null, 2) });
  }
});

app.get("/products/:id/image", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT imageBlob FROM products WHERE id = ?",
      [id]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const product = rows[0] as { imageBlob: Buffer | null };

      if (product.imageBlob) {
        res.setHeader("Content-Type", "image/jpg");
        return res.status(200).send(product.imageBlob);
      }
    }

    res.status(404).json({ message: "Imagem não encontrada." });
  } catch (error) {
    console.error("Erro ao carregar imagem:", error);
    res.status(500).json({ message: "Erro ao carregar imagem." });
  }
});

app.put("/products/:id/image", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: "Imagem é obrigatória." });
  }

  try {
    await db.execute("UPDATE products SET imageBlob = ? WHERE id = ?", [
      Buffer.from(image, "base64"), // Converte a imagem de base64 de volta para BLOB
      id,
    ]);
    res.status(200).json({ message: "Imagem atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar imagem:", error);
    res.status(500).json({ message: "Erro ao atualizar imagem." });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email ou senha estao vazios." });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (Array.isArray(rows) && rows.length > 0) {
      const user: User = rows[0] as User;
      const result = await bcrypt.compare(password, user.password);

      if (result) {
        return res.status(204).send();
      } else {
        return res.status(401).json({ message: "Usario ou senha incorretos." });
      }
    } else {
      return res.status(401).json({ message: "Usario ou senha incorretos." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Falha desconhecida no login" });
  }
});

app.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email ou senha estao vazios." });
  }

  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (Array.isArray(rows) && rows.length > 0) {
    return res
      .status(409)
      .json({ message: "Email já esta cadastrado a uma conta." });
  }
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

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
