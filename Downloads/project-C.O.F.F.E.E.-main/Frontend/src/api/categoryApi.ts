import instance from './instance';

export interface Category {
    id: string;
    name: string;
    isActive: boolean;
}

export interface CategoryRequest {
    name: string;
    isActive: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await instance.get('/category');
    return response.data.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
    const response = await instance.get(`/category/${id}`);
    return response.data.data;
};

export const createCategory = async (data: CategoryRequest): Promise<Category> => {
    const response = await instance.post('/category', data);
    return response.data.data;
};

export const updateCategory = async (id: string, data: CategoryRequest): Promise<Category> => {
    const response = await instance.put(`/category/${id}`, data);
    return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await instance.delete(`/category/${id}`);
};