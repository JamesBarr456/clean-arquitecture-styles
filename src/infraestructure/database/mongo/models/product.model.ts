import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    description: { type: String, },
    size: { type: [String], default: [] },
     genre: {
      type: [String],
      enum: ['male', 'female', 'unisex', "kids"],
      default: ['unisex'] 
    },
    cost_price: { type: Number, required: true },
    sale_price: { type: Number, required: true },
    has_discount: { type: Boolean, default: false },
    discount_percentage: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    image: { type: [String], default: [] },
    is_active: { type: Boolean, default: true },
    category: { type: [String], default: [] }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export const ProductModel = model('Product', productSchema);