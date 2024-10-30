import express,{Router} from 'express'
import productController from '../controller/productController'

const router:Router =express.Router()

router.route("/product").post(productController.postProducts)

export default router