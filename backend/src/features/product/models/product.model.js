import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    ProductImage: { type: [String], required: true },
    material: { type: String, required: true },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    category: {
      type: String,
      required: true,
      set: (value) => value.toLowerCase(),
    },
    productItems: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'ProductItem' },
    ],
    status: { type: String, enum: ['active', 'draft'], default: 'draft' },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', productSchema);

export default Product;

const productItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    SKU: { type: String, unique: true, required: true },
    inventoryCount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    oldPrice: { type: Number },
    newPrice: { type: Number },
    promotionCategory: { type: String },
    promotionActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const ProductItem = mongoose.model('ProductItem', productItemSchema);

export { ProductItem };
