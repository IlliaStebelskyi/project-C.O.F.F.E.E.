import instance from './instance';

export interface UserProfile {
    email: string;
    name: string;
    lastName: string;
    phone: string | null;
    birthDate: string | null;
    preferences: string | null;
    role: string;
}

export interface UpdateProfileRequest {
    name: string;
    lastName: string;
    phone: string | null;
    birthDate: string | null;
    preferences: string | null;
}

export const getMyProfile = async (): Promise<UserProfile> => {
    const response = await instance.get('/user/me');
    return response.data.data;
};

export const updateMyProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await instance.put('/user/me', data);
    return response.data.data;
};