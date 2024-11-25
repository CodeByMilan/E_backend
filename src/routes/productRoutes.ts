import express,{Router} from 'express'
import productController from '../controller/productController'
import authMiddleware, { Role } from '../middleware/authMiddleware'
import {multer,storage} from '../middleware/multerConfig'

const upload = multer({storage : storage})
const router:Router =express.Router()

router.route("/admin/product").post(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),upload.single('image'),productController.postProducts)

router.route("/product").get(productController.getAllProducts)

router.route("/product/:id").get(productController.getOneProduct)
.patch(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),upload.single('image'),productController.updateProduct)

router.route("/admin/product/:id")
.delete(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),productController.deleteProduct)
export default router