import { NextFunction, Request, Response } from "express";
import { ProductModel } from "../models/productModel";

export class ProductController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await ProductModel.getAll();
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Falha ao retornar produtos." });
    }
  };

  static create = async (req: Request, res: Response) => {
    const { name, description, value, quantity } = req.body;

    if (
      !name ||
      !description ||
      value === undefined ||
      quantity === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      const productId = await ProductModel.create({ name, description, value, quantity });
      return res.status(200).json({ productId });
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      return res.status(500).json({ message: "Erro ao criar produto." });
    }
  };

  static update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, value, quantity } = req.body;
    if (
      !name ||
      !description ||
      value === undefined ||
      quantity === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      await ProductModel.update(Number(id), {
        name,
        description,
        value,
        quantity,
      });
      return res
        .status(200)
        .json({ message: "Produto atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      return res.status(500).json({ message: "Erro ao atualizar produto." });
    }
  };

  static delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "O ID do produto é obrigatório." });
    }

    try {
      // Verifica se o produto existe
      const product = await ProductModel.findOne(id);

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      await ProductModel.remove(id);

      return res.status(200).json({ message: "Produto deletado com sucesso." });
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  };

  static getImage = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const imageBlob = await ProductModel.getImage(Number(id));

      if (imageBlob) {
        res.setHeader("Content-Type", "image/jpg");
        return res.status(200).send(imageBlob);
      }

      return res.status(404).json({ message: "Imagem não encontrada." });
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      return res.status(500).json({ message: "Erro ao carregar imagem." });
    }
  };

  static updateImage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Imagem é obrigatória." });
    }

    try {
      await ProductModel.updateImage(Number(id), image);
      return res
        .status(200)
        .json({ message: "Imagem atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
      return res.status(500).json({ message: "Erro ao atualizar imagem." });
    }
  };
}
