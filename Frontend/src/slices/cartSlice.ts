import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as cartApi from '../api/cartApi';
import type { RootState } from './index';

type CartState = {
    cart: cartApi.Cart | null;
    isLoading: boolean;
    error: string | null;
};

const initialState: CartState = { cart: null, isLoading: false, error: null };

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
    return await cartApi.getCart();
});

export const addToCart = createAsyncThunk(
    'cart/addItem',
    async (data: cartApi.AddCartItemRequest) => {
        return await cartApi.addCartItem(data);
    },
);

export const updateCartItemQuantity = createAsyncThunk(
    'cart/updateItem',
    async ({
        productId,
        data,
    }: {
        productId: string;
        data: cartApi.UpdateCartItemRequest;
    }) => {
        return await cartApi.updateCartItem(productId, data);
    },
);

export const removeFromCart = createAsyncThunk('cart/removeItem', async (productId: string) => {
    return await cartApi.removeCartItem(productId);
});

export const clearCartThunk = createAsyncThunk('cart/clear', async () => {
    await cartApi.clearCart();
});

const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCart: (state) => {
            state.cart = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? 'Failed to load cart.';
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(clearCartThunk.fulfilled, (state) => {
                state.cart = null;
            });
    },
});

export const { resetCart } = slice.actions;

export default slice.reducer;

export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartItemCount = (state: RootState) =>
    state.cart.cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
