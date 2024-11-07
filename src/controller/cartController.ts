import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Cart from "../database/models/Cart";
import Product from "../database/models/Product";
import Category from "../database/models/Category";

class cartController {
  async addToCart(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { quantity, productId } = req.body;
    if (!quantity || !productId) {
      res.status(400).json({
        message: "quantity and product id are required",
      });
    }
    //check if the user have already added the product to the cart or not
    let cartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      //insert into cart
      cartItem = await Cart.create({
        userId,
        productId,
        quantity,
      });
    }
    res.json({
      message: "product added to cart successfully",
      data: cartItem,
    });
  }
  async getMyCarts(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const cartItem = await Cart.findAll({
      where: {
        userId,
      },
      attributes:['id',"quantity"],
      include: [
        {
          model: Product,
          attributes:["id","productName","productQuantity","description","productImageUrl"],
          include:[
            {
              model:Category,
              attributes:["id","categoryName"]
            }
          ]
        },
      ],
     
    });
    if(cartItem.length=== 0){
        res.status(404).json({
            message: "no cart item found",
            });
    }else{
        res.status(200).json({
            message:"cart items fetched successfully",
            data:cartItem
        })
    }
  }

  async deleteMyCartItems (req:AuthRequest,res:Response):Promise<void>{
    const userId=req.user?.id;
    const {productId}=req.params;
    //check whether the above productId product exist or not 
    const  product=await Product.findByPk(productId)
    if(!product){
      res.status(404).json({
        message:"product not found"
        })
        return
        }
        //delete that productId from userCart
        await Cart.destroy({
          where :{
            userId,
            productId
          }
        })
        res.status(200).json({
          message:"cart item deleted successfully"
        })
  }
  async updateCartItem(req:AuthRequest,res:Response):Promise<void>{
    const userId=req.user?.id;
    const{productId}=req.params;
    const{quantity}=req.body;
    if(!quantity){
      res.status(400).json({
        message:"quantity is required"
        })
        return
    }

    const cartData =await Cart.findOne({
      where:{
        userId,
        productId
        }
    })
    if(cartData){
    cartData.quantity=quantity
    await cartData?.save()
    res.status(200).json({
      message:"cart item updated successfully",
      data:cartData
      })
  }
  else{
    res.status(404).json({
      message:"no productId for the userId "
    })
  }
}
}
export default new cartController();
