import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel";

export class UserController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email ou senha estão vazios." });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Usuário ou senha inválidos." });
      }

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        return res.status(204).send(); // Poderia retornar um token JWT para autenticação futura, mas por simplicidade, não retornei nada.
      }

      return res.status(401).json({ message: "Usuário ou senha inválidos." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Falha desconhecida no login" });
    }
  }

  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email ou senha estão vazios." });
    }

    try {
      const user = await UserModel.findByEmail(email);

      if (user) {
        return res
          .status(409)
          .json({ message: "Email já esta cadastrado a uma conta." });
      }

      await UserModel.createUser(username, email, password);

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar usuário." });
    }
  }
}
