import axios from "axios";
import {UpdateUserRequest} from "../types/UpdateUserRequest.ts";
import {UserResponse} from "../types/User.interface.ts";

const BASE_URL = 'http://localhost:3000/api/v1';

export const updateUserService = {
  async update(userId: number, userData: UpdateUserRequest): Promise<UserResponse> {
    const {data} = await axios.put(`${BASE_URL}/user/update/${userId}`, userData);
    return data;
  },
};
