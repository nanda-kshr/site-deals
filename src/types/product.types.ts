
export type Product = {
  createdAt: Date | string;
  _id: string;
  title: string;
  fileId: string;
  gallery?: string[];
  price: number;
  discount: number;
  rating: number;
  designTypes?: string[];
  description?: string;
  [key: string]: string | number | string[] | Date | undefined;

}
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