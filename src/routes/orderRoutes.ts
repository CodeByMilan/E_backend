import express,{Router} from 'express'
import authMiddleware, { Role } from '../middleware/authMiddleware'
import errorHandler from '../services/catchAsyncError'
import orderController from '../controller/orderController'


const router:Router =express.Router()

router.route("/order")
.post(authMiddleware.isAuthenticated,errorHandler(orderController.createOrder))
router.route("/verify")
.post(authMiddleware.isAuthenticated,errorHandler(orderController.verifyTransaction))

router.route("/")
.post(authMiddleware.isAuthenticated,errorHandler(orderController.fetchMyOrder))

router.route("/:id")
.patch(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.CUSTOMER),errorHandler(orderController.cancelOrder))
.get(authMiddleware.isAuthenticated,errorHandler(orderController.fetchMyOrderDetails))
export default router