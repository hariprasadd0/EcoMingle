import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from '../../../utils/asyncHandler.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import User from '../../user/models/user.model.js';
import Order from '../../order/models/order.model.js';
import Product, { ProductItem } from '../../product/models/product.model.js';
import sendMail from '../../../utils/sendMail.js';
import Vendor from '../../vendor/models/vendor.model.js';

//order Management and chart data,profit loss and sales analytic
//users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users) {
    throw new ApiError(401, 'Users not found');
  }
  return res.status(200).json(new ApiResponse(200, { users }, 'Users'));
});

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res.status(200).json(new ApiResponse(200, { user }, 'User'));
});
//    - `PUT /api/admin/users/:userId` - Update user by ID
export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { username, email, role } = req.body;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      username,
      email,
      role,
    },
    { new: true },
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res.status(200).json(new ApiResponse(200, { user }, 'User updated'));
});
//    - `DELETE /api/admin/users/:userId` - Delete user by ID
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res.status(200).json(new ApiResponse(200, {}, 'User deleted'));
});

// 2. **Vendor Management by Admin**
// - Get applied vendors
export const getAppliedVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({ status: 'pending' });
  if (!vendors) {
    throw new ApiError(401, 'no vendors found');
  }
  return res.json(new ApiResponse(200, vendors, 'vendors'));
});
// post approve vendor
export const approveVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const vendor = await Vendor.findByIdAndUpdate(id, { status: 'approved' });
  if (!vendor) {
    throw new ApiError(400, 'no vendors found');
  }
  return res.json(new ApiResponse(200, vendor, 'vendor approved'));
});
// post reject vendor
export const rejectVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vendor = await Vendor.findByIdAndUpdate(id, { status: 'rejected' });

  const file = vendor.files[0].fileUrl;
  if (!file) {
    throw new ApiError(400, 'file not found');
  }
  const publicId = 'uploads/' + file.split('/').pop();

  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
      });
    } catch (error) {
      throw new Error('error', error);
    }
  }

  if (!vendor) {
    throw new ApiError(400, 'no vendors found');
  }
  return res.json(new ApiResponse(200, vendor, 'vendor rejected'));
});
//    - `GET /api/admin/vendors` - Get all vendors
export const getVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({});
  if (!vendors) {
    throw new ApiError(400, 'no vendors found');
  }
  return res.json(new ApiResponse(200, vendors, 'vendors'));
});
//    - `GET /api/admin/vendors/:vendorId` - Get vendor by ID
export const getVendorById = asyncHandler(async (req, res) => {
  const { vId } = req.params;
  if (!vId) {
    throw new ApiError(400, 'vendor id required');
  }
  const vendor = await Vendor.findById(vId).select('-password -refreshToken');
  if (!vendor) {
    throw new ApiError(200, 'no vendor found');
  }
  return res.json(new ApiResponse(200, vendor, 'vendor'));
});
//    - `PUT /api/admin/vendors/:vendorId` - Update vendor by ID
export const updateVendor = asyncHandler(async (req, res) => {
  const { vId } = req.params;
});
//    - `DELETE /api/admin/vendors/:vendorId` - Delete vendor by ID
export const deleteVendor = asyncHandler(async (req, res) => {
  const { vId } = req.params;
  const vendor = await Vendor.findByIdAndDelete(vId);
  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }
  return res.json(new ApiResponse(200, {}, 'Vendor deleted'));
});
// 3. **Product Management by Admin**
//    - `GET /api/admin/products` - Get all products
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  if (!products) {
    throw new ApiError(400, 'no products found');
  }
  return res.json(new ApiResponse(200, products, 'products'));
});
//    - `GET /api/admin/products/:productId` - Get product by ID
export const getProductById = asyncHandler(async (req, res) => {
  const { pId } = req.params;
  if (!pId) {
    throw new ApiError(400, 'product id required');
  }
  const product = await Product.findById(pId);
  if (!product) {
    throw new ApiError(200, 'no product found');
  }
  return res.json(new ApiResponse(200, product, 'product'));
});
//    - `DELETE /api/admin/products/:productId` - Delete product by ID
export const deleteProduct = asyncHandler(async (req, res) => {
  const { pId } = req.params;
  const product = await Product.findByIdAndDelete(pId);
  const productItems = await ProductItem.deleteMany({ productId: pId });
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return res.json(new ApiResponse(200, {}, 'Product deleted'));
});
//    - `PATCH /api/admin/update-item/:id` - Update product item by ID
export const updateProductItem = asyncHandler(async (req, res) => {
  const { pId } = req.params;
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const { pId } = req.params;

  const product = await Product.findById(pId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  product.status = 'active';
  await product.save();
  return res.json(new ApiResponse(200, product, 'Product status updated'));
});

// ### Admin Authentication and Profile Management
//    - `POST /api/admin/register` - Register an admin
//    - `POST /api/admin/login` - Login an admin

//    - `GET /api/admin/profile` - Get admin profile
export const getProfile = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.user.id).select(
    '-password -refreshToken',
  );
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }
  return res.json(new ApiResponse(200, admin, 'admin'));
});
//    - `PUT /api/admin/profile` - Update admin profile
export const updateProfile = asyncHandler(async (req, res) => {
  const admin = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }
  return res.json(new ApiResponse(200, admin, 'admin updated'));
});
//    - `DELETE /api/admin/profile` - Delete admin profile

//Order Management and chart data,profit loss and sales analytics
