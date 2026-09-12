import { API } from './axiosInstance';
import type { UserProfileDto } from '../types/user';

export const userApi = {
  getProfile: async (): Promise<UserProfileDto> => {
    const response = await API.get<UserProfileDto>('/User/me');
    return response.data;
  },
};