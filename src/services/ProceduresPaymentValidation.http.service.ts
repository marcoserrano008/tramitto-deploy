import axios from "axios";
import {VerificarDeudaResponse} from "../types/VerificarDeudaResponse.interface.ts";

const BASE_URL: string = "http://165.1.120.191:3000/api/v1/procedures";

export const procedurePaymentValidationService = {
  async verifyDeuda(deudaId: string): Promise<VerificarDeudaResponse> {
    const response = await axios.get<VerificarDeudaResponse>(`${BASE_URL}/pagos/deudas/${deudaId}/verificar`);
    return response.data;
  }
};