import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Product, { ProductItem } from '../../product/models/product.model.js';
import User from '../../user/models/user.model.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import uploadFile from '../../../utils/cloudinary.js';
import fs from 'fs';
import Cart from '../../user/models/cart.model.js';
import Vendor from '../../vendor/models/vendor.model.js';

//get all product items
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate('productItems');

  if (!products) {
    throw new ApiError(401, 'Products not found');
  }

  return res.status(200).json(new ApiResponse(200, { products }, 'Products'));
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate('productItems');
  if (!product) return new ApiError(404, 'Product not found');
  return res.status(200).json(new ApiResponse(200, { product }, 'Product'));
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { productName, price, description, category, material } = req.body;

    const vendor = req.user.id;

    // Upload images
    const imageUrls = [];

    await Promise.all(
      req.files.map(async (file) => {
        const { path } = file;
        const result = await uploadFile(path);
        if (result && result.secure_url) {
          imageUrls.push(result.secure_url);
          if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
              if (err) {
                console.error(`Error deleting file ${path}:`, err);
              }
            });
          }
        }
      }),
    );
    if (imageUrls.length === 0) {
      throw new ApiError(400, 'Image upload failed');
    }

    const product = new Product({
      productName,
      price,
      description,
      ProductImage: imageUrls,
      category,
      vendor,
      material: material,
    });
    console.log('product', product);

    try {
      await product.save();
    } catch (error) {
      console.log(error);
      throw new ApiError(400, error);
    }
    if (!product) {
      throw new ApiError(400, 'Product not created');
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { product }, 'Product created successfully'));
  } catch (error) {
    console.log(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  // Need product id
  const { pId } = req.params;

  const product = await Product.findById(pId);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Product data via req.body
  const { productName, price, description, category, material } = req.body;

  const files = req.files;
  const imageUrls = [];
  const productImg = product.ProductImage;
  const newImgUploaded = files && files.length > 0;

  // Delete old images
  if (newImgUploaded && productImg && productImg.length > 0) {
    await Promise.all(
      productImg.map(async (image) => {
        const publicId = 'uploads/' + image.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log('Deleted:', publicId);
        } catch (error) {
          throw new ApiError(500, 'Error in deleting old images');
        }
      }),
    );
  }

  // Upload new images
  if (newImgUploaded) {
    await Promise.all(
      files.map(async (file) => {
        const { path } = file;
        try {
          const result = await uploadFile(path);

          if (result && result.secure_url) {
            imageUrls.push(result.secure_url);
          }
        } catch (error) {
          console.log('Error uploading file:', path, error);
        }
      }),
    );
  }

  // Update product fields
  product.productName = productName || product.productName;
  product.price = price || product.price;
  product.description = description || product.description;
  product.category = category ? category.toLowerCase() : product.category;
  product.material = material ? material.toLowerCase() : product.material;
  // Update product images if new ones were uploaded
  if (imageUrls.length > 0) {
    product.ProductImage = imageUrls;
  }

  await product.save();

  let updatedProduct = await Product.findById(pId).populate('productItems');

  if (!updatedProduct) {
    throw new ApiError(400, 'Product not updated');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedProduct }, 'Product updated successfully'),
    );
});

//delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { pId } = req.params;

  const product = await Product.findById(pId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  try {
    if (product.ProductImage && product.ProductImage.length > 0) {
      await Promise.all(
        product.ProductImage.map(async (imageUrl) => {
          const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted image: ${publicId}`);
          } catch (error) {
            console.error(
              `Error deleting image from Cloudinary: ${error.message}`,
            );
          }
        }),
      );
    }
    await ProductItem.deleteMany({ productId: pId });
    await Product.findByIdAndDelete(pId);
  } catch (error) {
    throw new ApiError(500, 'Error in deleting product');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, 'Product deleted successfully'));
});
//get product items by category
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const searchCategory = category ? new RegExp(category, 'i') : '';

  if (!searchCategory) {
    throw new ApiError(400, 'Invalid category');
  }
  const products = await Product.find({
    category: { $regex: searchCategory },
  }).populate('productItems');

  if (!products) {
    throw new ApiError(404, 'Products not found');
  }
  return res.status(200).json(new ApiResponse(200, { products }, 'Products'));
});
//wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  const user = await User.findById(userId);

  const alreadyAdded = user.wishlist.includes(productId);

  let updatedUser;
  if (alreadyAdded) {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true },
    );
  } else {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { wishlist: productId } },
      { new: true },
    );
  }

  return res.json(new ApiResponse(200, { user: updatedUser }));
});

//cart
const addToCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId } = req.body;
    const quantity = Number.parseInt(req.body.quantity);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, 'Invalid product ID');
    }
    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    const productImage = product.ProductImage[0];
    if (!productImage) {
      throw new ApiError(400, 'Product image is missing');
    }

    let cart = await Cart.findOne({ user: userId });

    let vendor = await Vendor.findById(product.vendor);
    if (!vendor) {
      throw new ApiError(400, 'vendor not found');
    }

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            productItem: productId,
            productName: product.productName,
            productImage: productImage,
            quantity,
            price: product.price,
            seller: vendor?.username,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productItem.toString() === productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.push({
          productItem: productId,
          productName: product.productName,
          productImage: productImage,
          price: product.price,
          quantity,
          seller: vendor?.username,
        });
      }
    }

    await cart.save();

    return res.json(new ApiResponse(200, { cart }, 'Product added to cart'));
  } catch (error) {
    throw new ApiError(400, 'Cart error');
  }
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  console.log(productId);

  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.productItem.toString() !== productId,
  );

  await cart.save();

  const updatedUser = await User.findById(userId).populate('cart');

  return res.json(
    new ApiResponse(200, { updatedUser }, 'Product removed from cart'),
  );
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  addToWishlist,
  addToCart,
  removeFromCart,
};
