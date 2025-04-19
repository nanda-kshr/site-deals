export type Product = {
  _id: {
    $oid: string;
  };
  id?: string;
  name: string;
  gallery: string[];
  price: number;
  discountPercentage: number;
  rating: number;
  attributes?: {
    size: Array<{
      value: string;
      fileId: string;
      price: number;
    }>;
    color: Array<{
      value: string;
      fileId: string;
      price: number;
    }>;
  };
  description?: string;
  createdAt: string;
  updatedAt?: string;
  fileId: string;
};

export interface IProduct {
  id:string;
  name: string;
  fileId: string;
  price: number;
  rating: number;
  discountPercentage: number;
  description?: string;
  createdAt?: Date;
  __v?: number;
}