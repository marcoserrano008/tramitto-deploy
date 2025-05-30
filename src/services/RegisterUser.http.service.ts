import axios from 'axios';
import {RegisterRequest} from "../types/RegisterRequest.interface.ts";

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const registerService = {
  register: async (registerData: RegisterRequest) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, registerData, {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};
