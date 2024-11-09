import express,{Router} from 'express'
import authMiddleware, { Role } from '../middleware/authMiddleware'
import errorHandler from '../services/catchAsyncError'
import orderController from '../controller/orderController'


const router:Router =express.Router()

router.route("")
.post(authMiddleware.isAuthenticated,errorHandler(orderController.createOrder))
router.route("/verify")
.post(authMiddleware.isAuthenticated,errorHandler(orderController.verifyTransaction))

router.route("/customer")
.get(authMiddleware.isAuthenticated,errorHandler(orderController.fetchMyOrder))

router.route("/customer/:id")
.patch(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.CUSTOMER),errorHandler(orderController.cancelOrder))
.get(authMiddleware.isAuthenticated,errorHandler(orderController.fetchMyOrderDetails))

router.route("/admin/payment/:id")
.patch(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),errorHandler(orderController.changePaymentStatus))

router.route("/admin/:id")
.patch(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),errorHandler(orderController.changeOrderStatus))
.delete(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),errorHandler(orderController.deleteOrder))
export default router