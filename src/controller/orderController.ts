import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import { OrderData, PaymentMethod } from "../types/orderTypes";
import Order from "../database/models/Order";
import Payment from "../database/models/Payment";
import OrderDetail from "../database/models/OrderDetails";

class OrderController {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    const {
      phoneNumber,
      shippingAddress,
      totalAmount,
      paymentDetails,
      items,
    }: OrderData = req.body;
    const userId = req.user?.id;
    if (
      !phoneNumber ||
      !shippingAddress ||
      !paymentDetails ||
      !paymentDetails.paymentMethod ||
      !totalAmount ||
      items.length == 0
    ) {
      res.status(400).json({
        message:
          "Please provide phoneNumber,shippingAddress,totalAmount,paymentDetails,items",
      });
      return;
    }
    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
    });
    const payment = await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,
    });
    for (var i=0;i<items.length;i++){
        await OrderDetail.create({
            quantity:items[i].quantity,
            productId:items[i].productId,
            orderId:orderData.id

        })
    }
    if(paymentDetails.paymentMethod===PaymentMethod.Khalti){
        //khalti integration
        
    }
    else{
        //cod 
        res.status(200).json({
            message: "Order placed successfully",
        })
    }
  }
}
export default OrderController