import express,{Router} from 'express'
import productController from '../controller/productController'
import {storage,multer} from '../middleware/multerConfig'
import authMiddleware, { Role } from '../middleware/authMiddleware'

const upload = multer({storage:storage})
const router:Router =express.Router()

router.route("/product").post(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),upload.single('image'),productController.postProducts).get(productController.getAllProducts)

export default router