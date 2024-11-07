import Category from "../database/models/Category";

import { Request, Response } from "express";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "food & Beverage",
    },
    {
      categoryName: "Beauty & Health",
    },
  ];
  async seedCategory(): Promise<void> {
    const data = await Category.findAll();
    if (data.length === 0) {
      const newCategory = await Category.bulkCreate(this.categoryData);
      console.log("categories created successfully");
    } else {
      console.log("categories already added");
    }
  }
  async addCategory(req: Request, res: Response): Promise<void> {
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(400).json({
        message: "category name is required",
      });
      return;
    } else {
      const newCategory = await Category.create({ categoryName });
      res.json({
        message: "category added successfully",
        newCategory,
      });
    }
  }
  async getAllCategories(req: Request, res: Response): Promise<void> {
    const data = await Category.findAll();
    if (data.length === 0) {
      res.status(404).json({
        message: "No categories found",
      });
    } else {
      res.json({
        message: "categories found successfully",
        data,
      });
    }
  }
  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = await Category.findAll({
      where: {
        id,
      },
    });
    if (data.length > 0) {
      await Category.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: "category deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "category not found",
      });
    }
  }
  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { categoryName } = req.body;
    const data = await Category.findAll({ 
        where: { 
            id 
        } 
    });
    if (data.length > 0) {
      await Category.update(
        {
         categoryName 
        }, 
        { 
            where: 
            { id } 
        });
      res.status(200).json({
        message: "category updated successfully",
      });
    } else {
      res.status(404).json({
        message: "category not found",
      });
    }
  }
}

export default new CategoryController();
