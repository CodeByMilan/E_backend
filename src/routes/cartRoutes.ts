import express,{Router} from 'express'
import authMiddleware, { Role } from '../middleware/authMiddleware'
import cartController from '../controller/cartController'


const router:Router =express.Router()

router.route("/cart")
.post(authMiddleware.isAuthenticated,cartController.addToCart)
.get(authMiddleware.isAuthenticated,cartController.getMyCarts)


export default router