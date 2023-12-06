import { ILoginRequest, INewUserRequest, IUser, IUserRequest } from "../types";
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
