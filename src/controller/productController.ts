import { Request,Response } from "express"
import Product from "../database/models/Product"
import { json } from "sequelize"


class productController {
    public static async  postProducts(req:Request,res:Response): Promise<void> {
        const {productName,price,description,productQuantity}=req.body
        let filename;
        if(req.file){
            filename=req.file?.filename
            }
            else{
                filename="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmZBWXUFYSEz3ZFW7Fa7wtzKdtMgcPqNpWvQ&s";
            }
        if (!productName|| !price||!description||!productQuantity) {
             res.status(400).json({
                message:"Please provide productName,price,description,productQuantity"
            })
            return
            }
            await Product.create({
                productName,
                price,
                description,
                productQuantity,
                productImageUrl:filename
                })
                res.status(200).json({
                    message:"product uploaded successfuly"
                })
            
            }
}
export default productController;