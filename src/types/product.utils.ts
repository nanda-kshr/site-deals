import { Product } from './product.types';

// Type guard to check if _id is MongoID
export function isMongoId(id: Product['_id']): id is { $oid: string } {
  return typeof id === 'object' && id !== null && '$oid' in id;
}

// Helper function to get product ID consistently
export function getProductId(product: Product): string {
  if (isMongoId(product._id)) {
    return product._id.$oid;
  }
  return product._id.toString();
}

// Default values for product
export const DEFAULT_PRODUCT: Partial<Product> = {
  name: "Unnamed Product",
  description: "No description available",
  discountPercentage: 0,
  rating: 3,
  price: 0,
  attributes: {
    size: [],
    color: []
  },
  gallery: [],
  createdAt: new Date().toISOString(),
  material: "Not specified",
  packageSize: 0
};