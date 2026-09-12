import { API } from './axiosInstance';
import type { LoginRequestDto, RegisterRequestDto, AuthResponseDto } from '../types/auth';

export const authApi = {
  login: async (data: LoginRequestDto): Promise<AuthResponseDto> => {
    const response = await API.post<AuthResponseDto>('/Auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequestDto): Promise<void> => {
    await API.post('/Auth/register', data);
  },
};