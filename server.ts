import { Request, Response } from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "./models/user";

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
    // rows é um array de objetos retornados pelo MySQL
    const products = (rows as any[]).map((row) => {
      let base64Image = null;

      // Se existir conteúdo de imagem, convertemos para base64
      if (row.imageBlob) {
        base64Image = Buffer.from(row.imageBlob).toString("base64");
        console.log(base64Image);
      }
      // Retorna um novo objeto já com a imagem em base64
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        image: base64Image, // <-- imagem convertida para base64
        quantity: row.quantity,
      };
    });
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Falha ao retornar produtos." });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email ou senha estao vazios." });
  }
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // se retornou pelo menos uma linha, quer dizer que o email existe no db.
    if (Array.isArray(rows) && rows.length > 0) {
      const user: User = rows[0] as User;
      const result = await bcrypt.compare(password, user.password); // o compare pega a senha encripitada do db e compara com a senha que o usuario nos cedeu
      // se deu match
      if (result) {
        return res.status(204).send(); // Prevençoes de seguranças : Poderia colocar um token para o usuario se autenticar nas proximas requisiçoes.
      } else {
        return res.status(401).json({ message: "Usario ou senha incorretos." }); // senha nao deu match com a senha concedida.
      }
    } else {
      // rows = 0 (Quando nao deu nenhum match com nenhum email e senha)
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

// Função para atualizar um produto

app.put("/product/update/:id", async (req: Request, res: Response) => {
  try {
    // A rota pode ser algo como PUT /products/:id
    // Então obtemos o "id" dos params
    const { id } = req.params;

    // Desestruturamos os dados do corpo da requisição
    const { name, description, quantity, image } = req.body;

    // Se a imagem vier em base64, convertemos para Buffer (BLOB)
    let imageBlob: Buffer | null = null;
    if (image) {
      imageBlob = Buffer.from(image, "base64");
    }

    // Montamos a query de UPDATE
    // Ajuste o nome das colunas conforme o seu banco
    const updateQuery = `
      UPDATE products
      SET
        name = ?,
        description = ?,
        quantity = ?,
        imageBlob = ?
      WHERE id = ?
    `;
    // Executamos a query, passando os valores

    await db.execute(updateQuery, [name, description, quantity, imageBlob, id]);

    return res.status(200).json({ message: "Produto atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return res.status(500).json({ error: "Erro ao atualizar produto." });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor servidor em http://localhost:${PORT}`);
});
