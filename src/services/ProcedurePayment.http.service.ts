import axios from "axios";
import {ProcedureResponse} from "../types/ProcedureResponse.interface.ts";
import {RegisterPaymentRequest} from "../types/RegisterPaymentRequest.interface.ts";

const BASE_URL: string = "https://test-app-ms.duckdns.org/api/v1/procedures";

export const procedurePaymentService = {
  async registerPayment(paymentRequest: RegisterPaymentRequest): Promise<ProcedureResponse> {
    const response = await axios.post<ProcedureResponse>(`${BASE_URL}/payment`, paymentRequest);

    return response.data;
  }
};
