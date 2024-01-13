import { IUser } from "../types/index";
import httpClient from "../utils/httpClient";

export const getProfile = async (token: string): Promise<IUser> => {
  return (
    await httpClient.get("/users/profile", {
      headers: {Authorization: `Bearer ${token}` },
    })
  ).data;
};

export const setUserCollege = async (
  payload: Record<string, string>,
): Promise<IUser> => {
  return (await httpClient.put("/users/college/", payload)).data;
};
