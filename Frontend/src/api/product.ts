import instance from './instance';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    categoryId: string;
    categoryName: string;
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    categoryId: string;
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await instance.get('/product');
    return response.data.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await instance.get(`/product/${id}`);
    return response.data.data;
};

export const createProduct = async (data: ProductRequest): Promise<Product> => {
    const response = await instance.post('/product', data);
    return response.data.data;
};

export const updateProduct = async (id: string, data: ProductRequest): Promise<Product> => {
    const response = await instance.put(`/product/${id}`, data);
    return response.data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await instance.delete(`/product/${id}`);
};