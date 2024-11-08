import express,{Router} from 'express'
import authMiddleware from '../middleware/authMiddleware'
import errorHandler from '../services/catchAsyncError'
import orderController from '../controller/orderController'


const router:Router =express.Router()

router.route("/order").post(authMiddleware.isAuthenticated,errorHandler(orderController.createOrder))
router.route("/verify").post(authMiddleware.isAuthenticated,errorHandler(orderController.verifyTransaction))
export default router