export const transformResponse = (product) => {
  return {
    id: product._id,
    productName: product.productName,
    description: product.description,
    ProductImage: product.ProductImage,
    material: product.material,
    vendor: product.vendor,
    category: product.category,
    status: product.status,
    // Flatten productItem fields
    SKU: product.productItem.SKU,
    inventoryCount: product.productItem.inventoryCount,
    currentPrice: product.productItem.newPrice,
    originalPrice: product.productItem.oldPrice,
    discount: product.productItem.discount,
    promotionCategory: product.productItem.promotionCategory,
    promotionActive: product.productItem.promotionActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};
