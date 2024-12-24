import express, { Router } from 'express';
import productController from '../controller/productController';
import authMiddleware, { Role } from '../middleware/authMiddleware';
import {multer,storage} from '../middleware/multerConfig'
import errorHandler from '../services/catchAsyncError';

const upload = multer({storage : storage}) 

const router: Router = express.Router();

router
  .route('/admin/product')
  .post(
    authMiddleware.isAuthenticated, 
    authMiddleware.resetrictTo(Role.ADMIN), 
    upload.single('image'), 
    (req, res, next) => {
        console.log('File in req.file:', req.file); 
        console.log('Request body:', req.body); 
        next();
      },
    productController.postProducts 
  );

router.route('/product').get(productController.getAllProducts)
router.route('/product/top').get(productController.getTopSellingProducts)
router.route('/product/:id').get(errorHandler( productController.getOneProduct));



router
  .route('/product/:id')
  .patch(
    authMiddleware.isAuthenticated, 
    authMiddleware.resetrictTo(Role.ADMIN), 
    upload.single('image'),
    productController.updateProduct 
  );


router
  .route('/admin/product/:id')
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.resetrictTo(Role.ADMIN), 
    productController.deleteProduct 
  );

export default router;
