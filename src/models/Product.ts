import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  srcUrl: string;
  gallery: string[];
  price: number;
  discountPercentage: number;
  rating: number;
  designTypes: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    srcUrl: { type: String, required: true },
    gallery: { type: [String], default: [] },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    designTypes: { type: [String], default: [] },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);