import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  id: string;
  name: string;
  type: 'normal' | 'special' | 'event';
  quantity: number;
}

interface GameState {
  money: number;
  items: Item[];
  badges: string[];
}

const initialState: GameState = {
  money: 3000,
  items: [],
  badges: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateMoney: (state, action: PayloadAction<number>) => {
      state.money = action.payload;
    },
    addItem: (state, action: PayloadAction<Item>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    addBadge: (state, action: PayloadAction<string>) => {
      if (!state.badges.includes(action.payload)) {
        state.badges.push(action.payload);
      }
    },
  },
});

export const { updateMoney, addItem, addBadge } = gameSlice.actions;
export default gameSlice.reducer; 