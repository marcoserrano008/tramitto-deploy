import axios from "axios";
import {VerificarDeudaResponse} from "../types/VerificarDeudaResponse.interface.ts";

const BASE_URL: string = "https://test-app-ms.duckdns.org/api/v1/procedures";

export const procedurePaymentValidationService = {
  async verifyDeuda(deudaId: string): Promise<VerificarDeudaResponse> {
    const response = await axios.get<VerificarDeudaResponse>(`${BASE_URL}/pagos/deudas/${deudaId}/verificar`);
    return response.data;
  }
};