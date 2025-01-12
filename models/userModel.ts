import { db } from "../config/db";
import bcrypt from "bcrypt";

type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as User;
    }
    return null;
  }

  static async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const encryptedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, encryptedPassword]
    );
  }
}

export { UserModel };
export type { User };
