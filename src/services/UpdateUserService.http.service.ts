import axios from "axios";
import {UpdateUserRequest} from "../types/UpdateUserRequest.ts";
import {UserResponse} from "../types/User.interface.ts";

const BASE_URL = 'https://test-app-ms.duckdns.org/api/v1';

export const updateUserService = {
  async update(userId: number, userData: UpdateUserRequest): Promise<UserResponse> {
    const {data} = await axios.put(`${BASE_URL}/user/update/${userId}`, userData);
    return data;
  },
};
