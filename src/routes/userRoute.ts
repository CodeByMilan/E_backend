import express,{Router} from 'express'
import AuthController from '../controller/userController'
import errorHandler from '../services/catchAsyncError'
import authMiddleware, { Role } from '../middleware/authMiddleware'
const router:Router=express.Router()

router.route("/register")
.post(errorHandler(AuthController.registerUser))

router.route("/login").post(errorHandler(AuthController.loginUser))


router.route("/admin/users")
.get(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),errorHandler(AuthController.fetchUserDetails))


router.route("/admin/users/:id")
.delete(authMiddleware.isAuthenticated,authMiddleware.resetrictTo(Role.ADMIN),errorHandler(AuthController.deleteUser))

export default router