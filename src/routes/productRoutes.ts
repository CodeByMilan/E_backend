import express,{Router} from 'express'
import productController from '../controller/productController'
import {storage,multer} from '../middleware/multerConfig'
import authMiddleware, { Role } from '../middleware/authMiddleware'

const upload = multer({storage:storage})
const router:Router =express.Router()

router.route("/admin/product").post(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),upload.single('image'),productController.postProducts)

router.route("/product").get(productController.getAllProducts)

router.route("/product/:id").get(productController.getOneProduct).delete(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),productController.deleteProduct)

export default router