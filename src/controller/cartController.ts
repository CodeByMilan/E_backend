import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Cart from "../database/models/Cart";
import Product from "../database/models/Product";

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
      include: [
        {
          model: Product,
          attributes:["productName","productQuantity"]
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
}
export default new cartController();
