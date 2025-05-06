export interface CartItem {
  id: string;
  title: string;
  fileId: string;
  price: number;
  discount: number;
  quantity: number;
  size: string;
  color: string;
  description: string;
  material: string;
  packageSize?: string;
  category?: string;
  gallery: string[];
  attributes: {
    size?: Array<{ value: string; price?: number; stock?: number }>;
    color?: Array<{ value: string; price?: number; stock?: number }>;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  adjustedTotalPrice: number;
  totalQuantities: number;
} 