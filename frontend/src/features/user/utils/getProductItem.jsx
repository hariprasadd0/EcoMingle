export const getProductItem = (product) => {
  if (!product.productItems || product.productItems.length === 0) {
    return {
      hasDiscount: false,
      price: product.price,
      inventory: 0,
    };
  }

  const activeItem = product.productItems.find((item) => item.promotionActive);

  return {
    hasDiscount: !!activeItem,
    price: activeItem ? activeItem.newPrice : product.price,
    oldPrice: activeItem ? activeItem.oldPrice : null,
    discount: activeItem ? activeItem.discount : 0,
    inventory: activeItem ? activeItem.inventoryCount : 0,
  };
};
