import 'dotenv/config';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import User from '../../user/models/user.model.js';
import Vendor from '../models/vendor.model.js';
import Product, { ProductItem } from '../../product/models/product.model.js';
import vendorSchema from '../../../validators/vendorSchema.js';
import uploadFile from '../../../utils/cloudinary.js';

//register
const createVendor = asyncHandler(async (req, res) => {
  const { error, value } = vendorSchema.validate(req.body, {
    abortEarly: false,
  });

  const {
    username,
    email,
    password,
    description,
    contact,
    gstin,
    pan,
    website,
    location,
    categories,
  } = value;
  if (error) {
    throw new ApiError(401, error.details.message);
  }

  const file = req.file;
  console.log(req.file.path);

  console.log(file);
  if (!file) {
    throw new ApiError(400, 'Image upload failed');
  }
  try {
    const pdfUpload = await uploadFile(req.file.path, 'uploads', 'raw');
    console.log(pdfUpload);
  } catch (error) {
    console.log(error);
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new ApiError(409, 'User already exists');
  }

  const vendor = new Vendor({
    username,
    email,
    password,
    description,
    contact,
    gstin,
    pan,
    website,
    location,
    categories,
    status: 'pending',
    role: 'vendor',
  });

  try {
    const newVendor = await vendor.save();
    return res.json(
      new ApiResponse(
        200,
        { newVendor },
        'Vendor registration submitted for review',
      ),
    );
  } catch (error) {
    throw new ApiError(400, error);
  }
});
//login
const vendorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Please provide credentials');
  }
  const vendor = await Vendor.findOne({ email });
  if (!vendor) {
    throw new ApiError(404, 'User not found');
  }
  if (vendor.status === 'pending') {
    throw new ApiError(401, 'Please wait for admin approval');
  }
  const isMatch = await vendor.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }
  const accessToken = vendor.generateAccessToken();

  const refreshToken = vendor.generateRefreshToken();
  vendor.refreshToken = refreshToken;
  await vendor.save({ validateBeforeSave: false });
  const options = {
    httpOnly: true,
    secure: true,
  };
  const refreshOptions = {
    httpOnly: true,
    secure: true,
    // path: '/refresh_token',
  };
  const loggedInVendor = await Vendor.findOne({ email }).select(
    '-gstin -pan -password  -refreshToken',
  );

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, refreshOptions)
    .json(new ApiResponse(200, loggedInVendor, 'Login successful'));
});
const getVendorProducts = asyncHandler(async (req, res) => {
  try {
    const { vId } = req.params;

    if (!vId) {
      throw new ApiError(404, 'vendor id required');
    }
    const products = await Product.find({ vendor: vId });

    if (!products) {
      throw new ApiError(400, 'unable to fetch products');
    }
    return res.json(new ApiResponse(200, { products }, 'products'));
  } catch (error) {
    throw new ApiError(400, 'error');
  }
});

const getVendor = asyncHandler(async (req, res) => {
  const { vId } = req.params;

  const vendor = await Vendor.findById(vId).select(
    '-gstin -pan -password -files -refreshToken',
  );

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }
  return res.json(new ApiResponse(200, { vendor }, 'Vendor'));
});
const updateVendor = asyncHandler(async (req, res) => {
  const { username, email, description, phone, website, location, categories } =
    req.body;

  const { vId } = req.params;

  if (!vId) {
    throw new ApiError(400, 'Please provide vendor id');
  }

  const updatedVendor = await Vendor.findByIdAndUpdate(
    vId,
    {
      username,
      email,
      description,
      phone,
      website,
      location,
      categories,
    },
    { new: true },
  );

  return res.json(
    new ApiResponse(200, { updatedVendor }, 'Vendor updated successfully'),
  );
});

const deleteVendor = asyncHandler(async (req, res) => {
  try {
    const { vId } = req.params;
    const vendor = await Vendor.findById(vId);
    if (!vendor) {
      return res.status(404).json(new ApiResponse(404, {}, 'Vendor not found'));
    }
    await Vendor.findByIdAndDelete(vId);

    // 2. Delete related products
    const products = await Product.find({ vendorId: vId });
    if (products.length > 0) {
      const productIds = products.map((product) => product._id);
      await Product.deleteMany({ vendorId: vId });

      // 3. Delete related product items
      await ProductItem.deleteMany({ productId: { $in: productIds } });
    }

    return res.json(new ApiResponse(200, {}, 'Vendor deleted successfully'));
  } catch (error) {
    throw new ApiError(400, error);
  }
});

export {
  createVendor,
  vendorLogin,
  updateVendor,
  deleteVendor,
  getVendor,
  getVendorProducts,
};
