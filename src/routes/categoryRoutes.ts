import express,{Router} from 'express'
import authMiddleware, { Role } from '../middleware/authMiddleware'
import categoryController from '../controller/categoryController'

const router:Router =express.Router()

router.route("/admin/category").post(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),categoryController.addCategory)

router.route("/category").get(categoryController.getAllCategories)

router.route("/category/:id")
.delete(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),categoryController.deleteCategory)
.patch(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),categoryController.updateCategory)

export default router