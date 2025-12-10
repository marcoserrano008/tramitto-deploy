import axios from "axios";
import {UserResponse} from "../types/User.interface.ts";
import {UsersByRoleAndEnabledRequest} from "../types/UsersByRoleAndEnabledRequest.interface.ts";

const BASE_URL = 'https://test-app-ms.duckdns.org/api/v1';

export const getUsersByRoleAndEnabled = {
  async getUsers(request: UsersByRoleAndEnabledRequest): Promise<UserResponse[]> {
    const url = `${BASE_URL}/user/byRole`;
    const {data} = await axios.post<UserResponse[]>(url, request);
    return data;
  },
};
