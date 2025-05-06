import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  fileId: string;
  gallery: string[];
  price: number;
  rating: number;
  attributes: {
    size: Array<{
      value: string;
      price: number;
      stock: number;
    }>;
    color: Array<{
      value: string;
      price: number;
      stock: number;
    }>;
  };
  discountPercentage: number;
  description: string;
  category: string;
  designTypes: string[];
  stock: number;
  material: string;
  packageSize: string;
  createdAt: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    fileId: { type: String, required: true },
    gallery: [{ type: String }],
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    attributes: {
      size: [{
        value: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true }
      }],
      color: [{
        value: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true }
      }]
    },
    discountPercentage: { type: Number, default: 0 },
    description: { type: String },
    category: { type: String },
    designTypes: [{ type: String }],
    stock: { type: Number, default: 0 },
    material: { type: String },
    packageSize: { type: String },
  },
  { timestamps: true }
);

// Add a virtual getter for formatted price in INR
productSchema.virtual('priceINR').get(function() {
  return `₹${this.price.toFixed(2)}`;
});

// Add virtual getters for size and color specific prices
productSchema.virtual('sizeSpecificPricesINR').get(function() {
  return this.attributes?.size.map(size => ({
    ...size,
    formattedPrice: `₹${size.price.toFixed(2)}`
  }));
});

productSchema.virtual('colorSpecificPricesINR').get(function() {
  return this.attributes?.color.map(color => ({
    ...color,
    formattedPrice: `₹${color.price.toFixed(2)}`
  }));
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);