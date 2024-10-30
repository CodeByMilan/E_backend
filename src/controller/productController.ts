import { Request,Response } from "express"
import Product from "../database/models/Product"
import { json } from "sequelize"


class productController {
    public static async  postProducts(req:Request,res:Response): Promise<void> {
        const {productName,price,description}=req.body
        let filename;
        if(req.file){
            filename=req.file.filename
            }
            else{
                filename="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmZBWXUFYSEz3ZFW7Fa7wtzKdtMgcPqNpWvQ&s";
            }
        if (!productName|| !price||!description) {
             res.status(400).json({
                message:"Please productName,price,description"
            })
            return
            }
            await Product.create({
                productName,
                price,
                description
                })
                res.status(200).json({
                    message:"product uploaded successfuly"
                })
            
            }
}
export default productController;