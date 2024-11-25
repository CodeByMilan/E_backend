import { AuthRequest } from "../middleware/authMiddleware";
import { Response, Request } from "express";
import {
  KhaltiResponse,
  OrderData,
  OrderStatus,
  PaymentMethod,
  paymentStatus,
  TransactionStatus,
  TransactionVerificationResponse,
} from "../types/orderTypes";
import Order from "../database/models/Order";
import Payment from "../database/models/Payment";
import OrderDetail from "../database/models/OrderDetails";
import axios from "axios";
import Product from "../database/models/Product";
import Cart from "../database/models/Cart";
import User from "../database/models/User";
import Category from "../database/models/Category";

class ExtendedOrder extends Order {
  declare paymentId: string | null;
}
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

    const paymentData = await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,
    });
    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
      paymentId: paymentData.id,
    });
    let responseOrderData;
    for (var i = 0; i < items.length; i++) {
      responseOrderData=await OrderDetail.create({
        quantity: items[i].quantity,
        productId: items[i].productId,
        orderId: orderData.id,
      });
      await Cart.destroy({
        where: {
          userId: req.user?.id,
          productId: items[i].productId,
        }
      })
    }
    if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
      //khalti integration
      const data = {
        return_url: "http://localhost:5173/success",
        purchase_order_id: orderData.id,
        amount: totalAmount * 100,
        website_url: "http://localhost:5173/",
        purchase_order_name: "ordername_" + orderData.id,
      };
      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "Key ba552c45d09e41f3a6ea812982b14950",
          },
        }
      );
      //    console.log(response)
      const khaltiResponse: KhaltiResponse = response.data;

      paymentData.pidx = khaltiResponse.pidx;
      paymentData.save();
      res.status(200).json({
        message: "payment initiated by khalti method",
        url: khaltiResponse.payment_url,
        data:responseOrderData
      });
    } else {
      //cod
      res.status(200).json({
        message: "Order placed successfully",
      });
    }
  }
  async verifyTransaction(req: AuthRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    const userId = req.user?.id;
    if (!pidx) {
      res.status(400).json({
        message: "pidx is required",
      });
      return;
    }
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: "Key ba552c45d09e41f3a6ea812982b14950",
        },
      }
    );
    const data: TransactionVerificationResponse = response.data;
    if (data.status == TransactionStatus.Completed) {
      await Payment.update(
        { paymentStatus: "paid" },
        {
          where: {
            pidx: pidx,
          },
        }
      );
      res.status(200).json({
        message: "payment verify successfully",
      });
    } else {
      res.status(200).json({
        message: "payment failed",
      });
    }
  }

  //Customer side starts
  async fetchMyOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: Payment,
        },
      ],
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "orders fetched successfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "no orders found for this user",
        data: [],
      });
    }
  }
  async fetchMyOrderDetails(req:AuthRequest,res:Response):Promise<void>{
    const orderId = req.params.id 
   const orderDetails =  await OrderDetail.findAll({
        where : {
            orderId
        },
        include : [{
            model : Product,
            include : [
                {
                    model : Category,
                    attributes : ["categoryName"]
                }
            ]
        },{
            model : Order,
            include : [{
                model : Payment,
                attributes : ["paymentMethod",'paymentStatus']
            },
            {
                model : User,
                attributes : ["username","email"]
            }
    ]
            
        }]
    })
    if(orderDetails.length > 0 ){
        res.status(200).json({
            message : "orderDetails fetched successfully",
            data : orderDetails
        })
    }else{
        res.status(404).json({
            message : "no any orderDetails of that id",
            data : []
        })
    }
}
  async cancelOrder(req: AuthRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const userId = req.user?.id;
    const order: any = await Order.findAll({
      where: {
        id: orderId,
        userId,
      },
    });
    if (
      order?.orderStatus === OrderStatus.Ontheway ||
      order?.orderStatus === OrderStatus.Preparation
    ) {
      res.status(200).json({
        message: "you cant cancel this order",
        data: [],
      });
      return;
    }
    const cancelOrder = await Order.update(
      {
        orderStatus: OrderStatus.Cancelled,
      },
      {
        where: {
          id: orderId,
          userId,
        },
      }
    );
    if (cancelOrder) {
      res.status(200).json({
        message: "order cancelled successfully",
        data: [],
      });
      return;
    }
    res.status(404).json({
      message: "order not found",
      data: [],
    });
  }
  //customer side ends here

  //admin side starts here
  async changeOrderStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const orderStatus: OrderStatus = req.body.orderStatus;
    await Order.update(
      {
        orderStatus: orderStatus,
      },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "order status changed successfully",
    });
  }

  async changePaymentStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const paymentStatus: paymentStatus = req.body.paymentStatus;
    const order = await Order.findByPk(orderId);
    const extendedOrder: ExtendedOrder = order as ExtendedOrder;

    await Payment.update(
      {
        paymentStatus: paymentStatus,
      },
      {
        where: {
          id: extendedOrder.paymentId,
        },
      }
    );
    res.status(200).json({
      message: `payment status of orderId ${orderId} changed successfully to paymentstatus ${paymentStatus}`,
    });
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);
    const extendedOrder: ExtendedOrder = order as ExtendedOrder;
    if (order) {
      await OrderDetail.destroy({
        where: {
          orderId: orderId,
        },
      });
      await Payment.destroy({
        where: {
          id: extendedOrder.paymentId,
        },
      });
      await Order.destroy({
        where: {
          id: orderId,
        },
      });
     
      res.status(200).json({
        message: `order with id ${orderId} deleted successfully`,
      });
    } else {
      res.status(404).json({
        message: `order with id ${orderId} not found`,
      });
    }
  }

  async fetchOrderDetails(req: AuthRequest, res: Response): Promise<void> {
    const orderDetails = await OrderDetail.findAll({
    
      include: [
        {
          model: Product,
        },
      ],
    });
    if (orderDetails.length > 0) {
      res.status(200).json({
        message: "order details fetched successfully",
        data: orderDetails,
      });
    } else {
      res.status(404).json({
        message: "no order details found for this id",
        data: [],
      });
    }
  }
  async fetchOrder(req: AuthRequest, res: Response): Promise<void> {
    const orders = await Order.findAll({
      include: [
        {
          model: Payment,
        },
      ],
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "orders fetched successfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "no orders found",
        data: [],
      });
    }
  }
}


export default new OrderController();
