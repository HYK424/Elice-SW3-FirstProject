import { Router } from 'express';
import { productController } from '../../controllers';
import { productImageUpload } from '../../middlewares';
import { productValidator } from '../../middlewares/validation';
import { asyncHandler } from '../../middlewares';

import { loginAuthenticator } from '../../middlewares/authentication';
import { checkRole } from '../../middlewares/authorization';

const productRouter = Router();

productRouter.get('/', asyncHandler(productController.getProducts));
productRouter.get('/:productId', asyncHandler(productController.getProudct));

//productRouter.use(loginAuthenticator.isLoggedIn, checkRole);
productRouter.post(
  '/',
  productImageUpload.single('image'),
  productValidator.createProduct,
  asyncHandler(productController.createProduct),
);
productRouter.put(
  '/:productId',
  productImageUpload.single('image'),
  productValidator.createProduct,
  asyncHandler(productController.updateProduct),
);
// productRouter.delete('/:productId', async(productController.deleteProduct));

export { productRouter };