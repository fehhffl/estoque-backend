import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel";

export class UserController {
  static async login(res: Response, req: Request, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email ou senha estao vazios." });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Usuario ou senha invalidos." });
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return res.status(204).send();
      }
      return res.status(401).json({ message: "Usuario ou senha invalidos." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Falha desconhecida no login" });
    }
  }

  static async register(res: Response, req: Request, next: NextFunction) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email ou senha estao vazios." });
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
      res.status(500).json({ message: "Erro ao criar usuario." });
    }
  }
}
