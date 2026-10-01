import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import type {
    IAddToCartPayload,
    ICartInitialState,
    IChangeQuantityPayload,
} from './cart.types';

const initialState: ICartInitialState = {
    items: [],
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<IAddToCartPayload>) => {
            const isExist = state.items.some(
                item => item.product.id === action.payload.product.id,
            );

            if (!isExist) {
                const newId = Date.now();
                state.items.push({ ...action.payload, id: newId });
            }
        },
        removeFromCart: (state, action: PayloadAction<{ id: number }>) => {
            state.items = state.items.filter(
                item => item.id !== action.payload.id,
            );
        },
        changeQuantity: (
            state,
            action: PayloadAction<IChangeQuantityPayload>,
        ) => {
            const { id, type } = action.payload;
            const item = state.items.find(item => item.id === id);

            if (!item) return;

            // the server accepts 1..99 per item
            if (type === 'plus' && item.quantity < 99) item.quantity++;
            if (type === 'minus' && item.quantity > 1) item.quantity--;
        },
        reset: state => {
            state.items = [];
        },
    },
});
