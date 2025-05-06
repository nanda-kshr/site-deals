export type Product = {
  category: undefined;
  _id: {
    $oid: string;
  };
  id?: string;
  name: string;
  fileId: string;
  gallery: string[];
  price: number;
  discountPercentage: number;
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
  description?: string;
  material?: string;
  packageSize?: number;
  createdAt: string;
  updatedAt?: string;
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