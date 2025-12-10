import axios from "axios";
import {ValidationResponse} from "../types/ValidationResponse.interface.ts";

const BASE_URL = "http://165.1.120.191:3000/api/v1";

export const faceValidationService = {
  async verify(formData: FormData): Promise<ValidationResponse> {
    const url = `${BASE_URL}/procedures/face-validation/verify`;
    const response = await axios.post<ValidationResponse>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 10000,
    });
    return response.data;
  },
};
