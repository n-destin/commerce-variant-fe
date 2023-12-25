<<<<<<< HEAD
import { IUser, IUserRequest } from "../types/index";
=======
import { ILoginRequest, INewUserRequest, IUser, IUserRequest } from "../types";
>>>>>>> 6bc9b13572b80ba157e7a457308b8491382115ef
import httpClient from "../utils/httpClient";

export const getMyProfile = async (): Promise<IUser> => {
    return (await httpClient.get(`/users/profile`)).data;
};

export const updateUserProfile = async (data: IUserRequest): Promise<IUser> => {
    return (await httpClient.put(`/users/${data.id}`, data)).data;
};

export const createNewUser = async (data: INewUserRequest): Promise<INewUserRequest> => {
    return (await httpClient.post(`/auth/signup`, data)).data;
};

export const login = async (data: ILoginRequest): Promise<string> => {
    return (await httpClient.post(`/auth/signin`, data)).data;
};

export const forgotPassword = async (data: ILoginRequest): Promise<ILoginRequest> => {
    return (await httpClient.post(`/auth/forgot-password`, data)).data;
};

export const resetPassword = async (data: ILoginRequest): Promise<ILoginRequest> => {
    return (await httpClient.put(`/auth/reset-password?token=${data.token}`, data)).data;
};

