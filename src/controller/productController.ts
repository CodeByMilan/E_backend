import { Request, Response } from "express";
import Product from "../database/models/Product";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../database/models/User";
import Category from "../database/models/Category";
import fs from "fs";
import path from "path";

class productController {
  public static async postProducts(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const userId = req.user?.id;

    let filename;
    // console.log("File in req.file:", req.file);
    // console.log("Request body:", req.body);
    if (req.file) {
      filename = req.file?.filename;
    } else {
      filename =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmZBWXUFYSEz3ZFW7Fa7wtzKdtMgcPqNpWvQ&s";
    }
    const { productName, price, description, productQuantity, categoryId } =
      req.body;
    if (
      !productName ||
      !price ||
      !description ||
      !productQuantity ||
      !categoryId
    ) {
      res.status(400).json({
        message:
          "Please provide productName,price,description,productQuantity,categoryId",
      });
      return;
    }
    await Product.create({
      productName,
      price,
      description,
      productQuantity,
      productImageUrl: filename,
      userId: userId,
      categoryId: categoryId,
    });
    res.status(200).json({
      message: "product uploaded successfuly",
    });
  }
  public static async getAllProducts(
    req: Request,
    res: Response
  ): Promise<void> {
    const data = await Product.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "email", "username"],
        },
        {
          model: Category,
          attributes: ["id", "categoryName"],
        },
      ],
    });
    res.status(200).json({
      message: "products fetched successfully",
      data,
    });
  }
  public static async getOneProduct(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const id = req.params.id;
    const data = await Product.findAll({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "email", "username"],
        },
        {
          model: Category,
          attributes: ["id", "categoryName"],
        },
      ],
    });
    if (data.length === 0) {
      res.status(404).json({
        message: "product not found",
      });
    } else {
      res.status(200).json({
        message: "product fetched successfully",
        data,
      });
    }
  }
  public static async deleteProduct(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const id = req.params.id;
    const data = await Product.findAll({
      where: {
        id: id,
      },
    });
    if (data.length > 0) {
      await Product.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: "product deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "product not found",
      });
    }
  }
  public static async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = await Product.findAll({ 
        where: { 
            id 
        } 
    });
    if (data.length > 0) {
        const { ProductName ,price,productQuantity,description,categoryId} = req.body;
      await Product.update(
        {
         productQuantity,
         ProductName,
         price,
         description,
         categoryId
        }, 
        { 
            where: 
            { id } 
        });
      res.status(200).json({
        message: "product updated successfully",
      });
    } else {
      res.status(404).json({
        message: "product not found",
      });
    }
  }
}
export default productController;
