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
      const item = state.items.find((i) => i.id === action.payload.id);
    
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
      }
    
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      state.adjustedTotalPrice = state.items.reduce(
        (sum, i) => sum + i.price * (1 - (i.discount || 0) / 100) * i.quantity,
        0
      );
    },


    removeFromCart(state, action: PayloadAction<string>) {
      if (!state.items) state.items = []; 
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      state.adjustedTotalPrice = state.items.reduce(
        (sum, i) => sum + i.price * (1 - (i.discount || 0) / 100) * i.quantity,
        0
      );
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      if (!state.items) state.items = []; 
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        }
      }
      console.log("quantity 2 - ",item)
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      state.adjustedTotalPrice = state.items.reduce(
        (sum, i) => sum + i.price * (1 - (i.discount || 0) / 100) * i.quantity,
        0
      );
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartsSlice.actions;
export default cartsSlice.reducer;