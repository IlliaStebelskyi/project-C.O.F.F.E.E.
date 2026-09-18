import type { LoginRequest } from "../types/Requests/LoginRequest";
import type { RegisterRequest } from "../types/Requests/RegisterRequest";
import instance, { setAccessToken } from "./instance";


interface AuthResponseData {
    accessToken: string;
}

export const getMe = () => {
    return instance.get('/user/me');
};


export const login = async (data: LoginRequest): Promise<string> => {
    const response = await instance.post('/auth/login', data);
    const { accessToken } = response.data.data as AuthResponseData;
    setAccessToken(accessToken);
    return accessToken;
};

export const register = async (data: RegisterRequest): Promise<string> => {
    const response = await instance.post('/auth/register', data);
    const { accessToken } = response.data.data as AuthResponseData;
    setAccessToken(accessToken);
    return accessToken;
};

export const logoutRequest = async () => {
    return instance.post('/auth/logout');
};