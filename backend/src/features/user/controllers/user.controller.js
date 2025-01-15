import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import uploadFile from '../../../utils/cloudinary.js';
import User from '../models/user.model.js';
import Product from '../../product/models/product.model.js';
import Cart from '../models/cart.model.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import sendMail from '../../../utils/sendMail.js';
import bcrypt from 'bcrypt';
import Order from '../../order/models/order.model.js';
import UserReview from '../../review/models/review.model.js';
import userSchema from '../../../validators/userSchema.js';
import Vendor from '../../vendor/models/vendor.model.js';

//create user
const registerUser = asyncHandler(async (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const { username, email, password } = value;

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new ApiError(409, 'User already exists');
  }

  try {
    const user = await User.create({ username, email, password });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'none',
      path: '/',
    };
    const refreshOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      path: '/',
    };
    return res
      .status(201)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, refreshOptions)
      .json(
        new ApiResponse(201, {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        }),
      );
  } catch (error) {
    throw new ApiError(500, 'Internal server error');
  }
});
//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new ApiError(400, 'Please add all fields');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000,
    sameSite: 'none',
    path: '/',
  };
  const refreshOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'none',
    path: '/',
  };
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, refreshOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        },
        'Logged in successfully',
      ),
    );
});
//logout user
const logoutUser = asyncHandler(async (req, res) => {
  try {
    const loggedOutUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          refreshToken: null,
        },
      },
      { new: true },
    );

    const options = {
      httpOnly: true,
    };
    return res
      .status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken')
      .json(new ApiResponse(200, {}, 'Logged out successfully'));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, 'Logout failed'));
  }
});
//refreshToken
const refreshToken = asyncHandler(async (req, res) => {
  const userRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!userRefreshToken) {
    throw new ApiError(401, 'Please provide refresh token');
  }

  try {
    let payload = jwt.verify(userRefreshToken, process.env.JWT_REFRESH_TOKEN);
    let userOrVendor = null;
    userOrVendor = await User.findById(payload.id);
    if (!userOrVendor) {
      userOrVendor = await Vendor.findById(payload.id);
    }
    if (userOrVendor?.refreshToken !== userRefreshToken) {
      throw new ApiError(401, 'Invalid refresh token or token mismatch');
    }
    const accessToken = userOrVendor.generateAccessToken();
    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'none',
      path: '/',
    };
    const refreshToken = userOrVendor.generateRefreshToken();
    const refreshOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      path: '/',
    };
    userOrVendor.refreshToken = refreshToken;
    await userOrVendor.save({ validateBeforeSave: false });
    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, refreshOptions)
      .json(new ApiResponse(200, { accessToken }, 'Refreshed successfully'));
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token Please Log in again');
  }
});
//update user
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { username, email } = req.body;
  const avatar = req.file ? req.file.path : null;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  let avatarUrl = null;
  if (avatar) {
    if (user.avatar) {
      const publicId = 'uploads/' + user.avatar.split('/').pop().split('.')[0];

      await cloudinary.uploader.destroy(publicId, () => {});
    }
    const result = await uploadFile(avatar);

    if (result && result.secure_url) {
      avatarUrl = result.secure_url;
    }
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.avatar = avatarUrl || user.avatar;

  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, 'User updated successfully'));
});
//forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  //email through body
  const email = req.body.email;
  //check if email exists
  if (!email) {
    throw new ApiError(400, 'Please provide email');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  //generate token
  const resetToken = user.generateResetToken();
  await user.save();
  //send email with token
  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
  const message = `Click here to reset your password: ${resetUrl}`;

  sendMail(email, 'Reset Password', message);
  return res.status(200).json(new ApiResponse(200, {}, 'Email sent'));
});
//reset password
const resetPassword = asyncHandler(async (req, res) => {
  const password = req.body.password;
  const user = req.user;
  if (!password) {
    throw new ApiError(400, 'Please provide password');
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password reset successfully'));
});
//protect routes
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const profile = {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    wishlist: user.wishlist,
    cart: user.cart,
    orderHistory: user.orderHistory,
  };
  return res.status(200).json(new ApiResponse(200, { profile }, 'Profile'));
});

const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(404, 'User not found');
  }

  const cart = await Cart.findOne({ user: userId });

  return res.status(200).json(new ApiResponse(200, { cart }, 'cart'));
});
//get wishlist
const getUserWhislist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(400, 'cant find user id');
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, 'cant fetch user');
  }
  console.log(user.wishlist);

  const wishlist = await Product.find({ _id: { $in: user.wishlist } });
  console.log(wishlist);

  return res.status(200).json(new ApiResponse(200, { wishlist }, 'wishlist'));
});
//rate product
const rateProduct = asyncHandler(async (req, res) => {
  const { pId } = req.params;
  const { rating, review } = req.body;
  const userId = req.user.id;
  if (!pId || !rating) {
    throw new ApiError(400, 'Missing required fields');
  }
  console.log(rating, review);

  const hasPurchased = await Order.findOne({
    user: userId,
    product: pId,
    status: { $in: ['delivered'] },
  });

  if (!hasPurchased) {
    throw new ApiError(401, 'User has not purchased this product');
  }
  const existingReview = await UserReview.findOne({ userId, productId: pId });
  console.log(existingReview);

  let newReview;
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.review.reviewText = reviewText;
    existingReview.review.reviewTitle = reviewTitle;
    newReview = await UserReview.save();
  } else {
    const reviewInstance = new UserReview({
      productId: pId,
      userId: userId,
      rating: rating,
      review: {
        reviewText: review.reviewText,
        reviewTitle: review.reviewTitle,
      },
    });
    newReview = await reviewInstance.save();
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { review: newReview }, 'Review saved'));
});

export {
  registerUser,
  getUserProfile,
  updateUser,
  loginUser,
  logoutUser,
  forgotPassword,
  refreshToken,
  resetPassword,
  getUserWhislist,
  rateProduct,
  getUserCart,
};
