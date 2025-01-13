import { db } from "../config/db";

type Product = {
  id: number;
  name: string;
  description: string;
  value: number;
  imageBlob: Blob;
  quantity: number;
};

class ProductModel {
  static async getAll(): Promise<Product[]> {
    const [rows] = await db.execute(
      "SELECT id, name, description, value, quantity FROM products"
    );
    return rows as Product[];
  }

  static async create(newProduct: {
    name: string;
    description: string;
    value: number;
    quantity: number;
  }): Promise<void> {
    await db.execute(
      "INSERT INTO products (name, description, value, quantity) VALUES (?, ?, ?, ?)",
      [
        newProduct.name,
        newProduct.description,
        newProduct.value,
        newProduct.quantity,
      ]
    );
  }

  static async update(
    id: number,
    updatedProduct: {
      name: string;
      description: string;
      value: number;
      quantity: number;
    }
  ): Promise<void> {
    await db.execute(
      "UPDATE products SET name = ?, description = ?, value = ?, quantity = ? WHERE id = ?",
      [
        updatedProduct.name,
        updatedProduct.description,
        updatedProduct.value,
        updatedProduct.quantity,
        id,
      ]
    );
  }
  static async findOne(id: string): Promise<Product | null> {
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [
      id,
    ]);

    if (Array.isArray(rows) && rows.length > 0) {
      const product = rows[0] as Product;
      return product;
    }
    return null;
  }

  static async remove(id: string): Promise<void> {
    await db.execute("DELETE from products WHERE id = ?", [id]);
  }

  static async getImage(id: number): Promise<Buffer | null> {
    const [rows] = await db.execute(
      "SELECT imageBlob FROM products WHERE id = ?",
      [id]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const product = rows[0] as { imageBlob: Buffer | null };
      return product.imageBlob;
    }
    return null;
  }

  static async updateImage(id: number, image: string): Promise<void> {
    await db.execute("UPDATE products SET imageBlob = ? WHERE id = ?", [
      Buffer.from(image, "base64"), // Converte a imagem de base64 de volta para BLOB
      id,
    ]);
  }
}

export type { Product };
export { ProductModel };
