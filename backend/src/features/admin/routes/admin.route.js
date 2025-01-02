import { Router } from 'express';
import { verifyJwt, isAdmin } from '../../../middleware/auth.middleware.js';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAppliedVendors,
  approveVendor,
  rejectVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getProducts,
  getProductById,
  deleteProduct,
  updateProductStatus,
} from '../controllers/admin.controller.js';
const router = Router();

router.get('/users', verifyJwt, isAdmin, getAllUsers);
router.get('/users/:id', verifyJwt, isAdmin, getUser);
router.put('/users/:userId', verifyJwt, isAdmin, updateUser);
router.delete('/users/:userId', verifyJwt, isAdmin, deleteUser);

// 2. **Vendor Management by Admin**
// - Get applied vendors
router.get('/vendors/applications', verifyJwt, isAdmin, getAppliedVendors);
// post approve vendor
router.post('/vendors/approve/:id', verifyJwt, isAdmin, approveVendor);
// post reject vendor
router.post('/vendors/reject/:id', verifyJwt, isAdmin, rejectVendor);

router.get('/vendors', verifyJwt, isAdmin, getVendors);
router.get('/vendors/:vId', verifyJwt, isAdmin, getVendorById);
router.post('vendors/:vId', verifyJwt, isAdmin, updateVendor);
router.delete('vendors/:vId', verifyJwt, isAdmin, deleteVendor);

// 3. **Product Management by Admin**
router.get('/products', verifyJwt, isAdmin, getProducts);
router.get('/products/:pId', verifyJwt, isAdmin, getProductById);
router.delete('/products/:pId', verifyJwt, isAdmin, deleteProduct);
router.post('/products/:pId', verifyJwt, isAdmin, updateProductStatus);

export default router;
