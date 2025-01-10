import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  updateUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  getUserWhislist,
  rateProduct,
  getUserCart,
} from '../controllers/user.controller.js';
import { verifyJwt } from '../../../middleware/auth.middleware.js';
import { verifyResetToken } from '../../../middleware/auth.middleware.js';
import { upload } from '../../../middleware/multer.middleware.js';
import {
  getProductById,
  getProductsByCategory,
  addToWishlist,
  addToCart,
  removeFromCart,
  getAllProducts,
} from '../../product/controllers/product.controller.js';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', verifyResetToken, resetPassword);
//protect routes
router.post('/refresh_token', refreshToken);
router.patch('/update', verifyJwt, upload.single('avatar'), updateUser);
router.post('/logout', verifyJwt, logoutUser);
router.get('/profile', verifyJwt, getUserProfile);
router.get('/wishlist', verifyJwt, getUserWhislist);
router.get('/cart', verifyJwt, getUserCart);
router.post('/orders/ratings/:pId', verifyJwt, rateProduct);

//products
router.get('/products/:id', getProductById);
router.get('/all-products', getAllProducts);
router.get('/category', getProductsByCategory);
router.put('/wishlist', verifyJwt, addToWishlist);
router.get('/cart', verifyJwt, getUserCart);
router.put('/cart', verifyJwt, addToCart);
router.delete('/cart/:productId', verifyJwt, removeFromCart);

export default router;
