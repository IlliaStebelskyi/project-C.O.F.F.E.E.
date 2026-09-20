import instance from './instance';

export interface CartItem {
    productId: string;
    productName: string;
    price: number;
    isAvailable: boolean;
    quantity: number;
    specialRequests: string | null;
}

export interface Cart {
    id: string;
    items: CartItem[];
    totalAmount: number;
}

export interface AddCartItemRequest {
    productId: string;
    quantity: number;
    specialRequests: string | null;
}

export interface UpdateCartItemRequest {
    quantity: number;
    specialRequests: string | null;
}

export const getCart = async (): Promise<Cart> => {
    const response = await instance.get('/cart');
    return response.data.data;
};

export const addCartItem = async (data: AddCartItemRequest): Promise<Cart> => {
    const response = await instance.post('/cart/items', data);
    return response.data.data;
};

export const updateCartItem = async (productId: string, data: UpdateCartItemRequest): Promise<Cart> => {
    const response = await instance.put(`/cart/items/${productId}`, data);
    return response.data.data;
};

export const removeCartItem = async (productId: string): Promise<Cart> => {
    const response = await instance.delete(`/cart/items/${productId}`);
    return response.data.data;
};

export const clearCart = async (): Promise<void> => {
    await instance.delete('/cart');
};

