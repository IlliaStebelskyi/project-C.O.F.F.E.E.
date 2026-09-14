import instance from './instance';

export interface OrderItemRequest {
    productId: string;
    quantity: number;
    specialRequests: string | null;
}

export interface CreateOrderRequest {
    items: OrderItemRequest[];
    expectedPickupTime: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    currentPrice: number;
    specialRequests: string | null;
}

export interface Order {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    expectedPickupTime: string;
    createdAt: string;
    items: OrderItem[];
}

export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
    const response = await instance.post('/order', data);
    return response.data.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
    const response = await instance.get(`/order/${id}`);
    return response.data.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
    const response = await instance.get('/order/my');
    return response.data.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
    const response = await instance.get('/order');
    return response.data.data;
};

export const updateOrder = async (id: string, data: CreateOrderRequest): Promise<Order> => {
    const response = await instance.put(`/order/${id}`, data);
    return response.data.data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
    const response = await instance.put(`/order/${id}/status`, { status });
    return response.data.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
    await instance.delete(`/order/${id}`);
};