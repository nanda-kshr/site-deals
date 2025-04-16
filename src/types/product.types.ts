
export type Product = {
  createdAt: any;
  id: string;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: number;
  rating: number;
  designTypes?: string[];
  description?: string;
  [key: string]: any;
};
