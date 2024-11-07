import express,{Router} from 'express'
import authMiddleware, { Role } from '../middleware/authMiddleware'
import cartController from '../controller/cartController'


const router:Router =express.Router()

router.route("/cart")
.post(authMiddleware.isAuthenticated,cartController.addToCart)
.get(authMiddleware.isAuthenticated,cartController.getMyCarts)

router.route("/cart/:productId")
.patch(authMiddleware.isAuthenticated,cartController.updateCartItem)
.delete(authMiddleware.isAuthenticated,cartController.deleteMyCartItems)


export default router