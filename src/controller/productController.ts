import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { QueryTypes } from "sequelize";
import Category from "../database/models/Category";
import Product from "../database/models/Product";
import User from "../database/models/User";
import { AuthRequest } from "../middleware/authMiddleware";
import { console } from "inspector";

class productController {
  public static async postProducts(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const userId = req.user?.id;
    let fileName;
    if (req.file) {
      fileName = `${process.env.CLOUDINARYIMAGEURL}/${req.file?.filename}`;
    } else {
      fileName =
        "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWlycG9kc3xlbnwwfHwwfHx8MA%3D%3D";
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
    const response = await Product.create({
      productName,
      price,
      description,
      productQuantity,
      productImageUrl: fileName,
      userId: userId,
      categoryId: categoryId,
    });
    res.status(200).json({
      message: "product uploaded successfuly",
      data: response,
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
    const data = await Product.findOne({
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
    if (!data) {
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
  public static async updateProduct(
    req: Request,
    res: Response
  ): Promise<void> {
    console.log("inside upadte product");
    const { id } = req.params;
    const data = await Product.findAll({
      where: {
        id,
      },
    });
    if (data.length > 0) {
      const { productName, price, productQuantity, description, categoryId } =
        req.body;
        console.log("productimageurl",data[0].productImageUrl)
      let filename = data[0].productImageUrl;
      if (req.file) {
        console.log("inside file",req.file.filename)
        const newImage = `${process.env.CLOUDINARYIMAGEURL}/${req.file?.filename}`;

        // Check if the current image is stored locally (not an HTTP URL)
        if (!filename.startsWith("https")) {
          const oldImagePath = path.join(__dirname, "../uploads", filename);
          if (fs.existsSync(oldImagePath)) {
            // Delete the old image from local storage
            fs.unlinkSync(oldImagePath);
          }
        }

        // Update filename to the new image
        filename = newImage;
      }
      const updateData = await Product.update(
        {
          productQuantity,
          productName,
          price,
          description,
          categoryId,
          productImageUrl: filename,
        },
        {
          where: { id },
        }
      );
      res.status(200).json({
        message: "product updated successfully",
        data: updateData,
      });
    } else {
      res.status(404).json({
        message: "product not found",
      });
    }
  }
  public static async getTopSellingProducts(
    req: Request,
    res: Response
  ): Promise<void> {
    const sql = `
        SELECT 
          p.id, 
          p.productName,
          p.price,
          p.description,
          p.productImageUrl,
          p.productQuantity,
          c.categoryName,
          COUNT(od.productId) AS total_sales
        FROM products p
        LEFT JOIN orderdetails od ON od.productId = p.id
        LEFT JOIN categories c ON c.id = p.categoryId
        GROUP BY p.id, c.categoryName
        ORDER BY total_sales DESC
        LIMIT 5;
      `;
    const topSellingProducts = await Product.sequelize?.query(sql, {
      type: QueryTypes.SELECT,
    });
    // console.log("Top Selling Products:", topSellingProducts);

    if (!topSellingProducts || topSellingProducts.length === 0) {
      res.status(404).json({
        message: "No top-selling products found",
      });
      return;
    }
    res.status(200).json({
      message: "Top-selling products fetched successfully",
      data: topSellingProducts,
    });
  }
}

export default productController;
