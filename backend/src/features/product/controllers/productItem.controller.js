import Product, { ProductItem } from '../models/product.model.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import { ApiError } from '../../../utils/ApiError.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';

const createProductItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    SKU,
    inventoryCount,
    discount,
    oldPrice,
    newPrice,
    promotionCategory,
    promotionActive,
  } = req.body;

  // Create new ProductItem
  const newProductItem = await ProductItem.create({
    productId: id,
    SKU,
    inventoryCount,
    discount,
    oldPrice,
    newPrice,
    promotionCategory,
    promotionActive,
  });

  // Find the associated product
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Update product with new ProductItem
  product.productItems.push(newProductItem._id);
  product.status = 'active';
  await product.save();

  // Get the updated product with populated productItems
  const updatedProduct = await Product.findById(id).populate('productItems');

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedProduct },
        'Item created and product updated successfully',
      ),
    );
});
//update product item
const updateProductItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    SKU,
    inventoryCount,
    discount,
    oldPrice,
    newPrice,
    promotionCategory,
    promotionActive,
  } = req.body;
  const productItem = await ProductItem.findById(id);
  if (!productItem) {
    throw new ApiError(404, 'Product item not found');
  }
  productItem.SKU = SKU || productItem.SKU;
  productItem.inventoryCount = inventoryCount || productItem.inventoryCount;
  productItem.discount = discount || productItem.discount;
  productItem.oldPrice = oldPrice || productItem.oldPrice;
  productItem.newPrice = newPrice || productItem.newPrice;
  productItem.promotionCategory =
    promotionCategory || productItem.promotionCategory;
  productItem.promotionActive = promotionActive || productItem.promotionActive;

  await productItem.save();
  const updatedProductItem = await ProductItem.findById(id);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedProductItem },
        'Product item updated successfully',
      ),
    );
});
//delete product item
const deleteProductItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productItem = await ProductItem.findById(id);
  if (!productItem) {
    throw new ApiError(404, 'Product item not found');
  }
  await productItem.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, 'Product item deleted successfully'));
});
export { createProductItem, updateProductItem, deleteProductItem };
