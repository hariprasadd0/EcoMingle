import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import 'dotenv/config';

export const verifyJwt = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req?.header('Authorization').replace('Bearer ', '');
  if (!token) {
    throw new ApiError(401, 'Unauthorized ');
  }
  const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
  const user = await User.findById(payload.id);
  if (!user) {
    throw new ApiError(401, 'Invalid Token');
  }
  req.user = user;
  next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (user.role !== 'admin') {
    throw new ApiError(401, 'Unauthorized');
  }
  next();
});

export const verifyResetToken = asyncHandler(async (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    throw new ApiError(401, 'Invalid Token');
  }
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid Token');
  }
  req.user = user;
  next();
});
