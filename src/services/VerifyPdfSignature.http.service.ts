import axios from "axios";
import {VerifySignaturesResponse} from "../types/VerifySignaturesResponse.interface.ts";

const BASE_URL = 'http://localhost:3000/api/v1';

export const verifyPdfSignatureService = {
  async verify(file: File): Promise<VerifySignaturesResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const {data} = await axios.post<VerifySignaturesResponse>(`${BASE_URL}/procedures/pdf-signatures/verify`, formData);
    return data;
  },
};
