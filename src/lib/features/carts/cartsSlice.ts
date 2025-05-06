import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  title: string;
  fileId: string;
  price: number;
  discount: number;
  rating: number;
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

interface CartState {
  totalQuantities: number;
  items: CartItem[];
  totalPrice: number;
  adjustedTotalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  adjustedTotalPrice: 0,
  totalQuantities: 0,
};

const cartsSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      if (!state.items) state.items = [];
      
      // Create unique identifier for the item including variations
      const itemId = `${action.payload.id}_${action.payload.size || 'default'}_${action.payload.color || 'default'}`;
      
      const item = state.items.find(
        (i) =>
          `${i.id}_${i.size || 'default'}_${i.color || 'default'}` === itemId
      );

      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
      }

      // Update totals
      state.totalQuantities = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      state.adjustedTotalPrice = state.items.reduce(
        (sum, i) => sum + i.price * (1 - (i.discount || 0) / 100) * i.quantity,
        0
      );
    },

    removeFromCart(state, action: PayloadAction<{ id: string; size: string; color: string }>) {
      if (!state.items) state.items = [];
      state.items = state.items.filter(
        (i) =>
          !(
            i.id === action.payload.id &&
            i.size === action.payload.size &&
            i.color === action.payload.color
          )
      );
      state.totalQuantities = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      state.adjustedTotalPrice = state.items.reduce(
        (sum, i) => sum + i.price * (1 - (i.discount || 0) / 100) * i.quantity,
        0
      );
    },

    updateQuantity(
      state,
      action: PayloadAction<{ id: string; size: string; color: string; quantity: number }>
    ) {
      if (!state.items) state.items = [];
      const item = state.items.find(
        (i) =>
          i.id === action.payload.id &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (i) =>
              !(
                i.id === action.payload.id &&
                i.size === action.payload.size &&
                i.color === action.payload.color
              )
          );
        }
      }
      state.totalQuantities = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      state.adjustedTotalPrice = state.items.reduce(
        (sum, i) => sum + i.price * (1 - (i.discount || 0) / 100) * i.quantity,
        0
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.adjustedTotalPrice = 0;
      state.totalQuantities = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartsSlice.actions;
export default cartsSlice.reducer;