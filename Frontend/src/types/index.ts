// src/types/index.ts
export interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  categoryId: number;
  category?: Category;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  specialRequests?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface Order {
  id: number;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  expectedPickupTime: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  currentPrice: number;
  specialRequests?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'Admin' | 'User';
}