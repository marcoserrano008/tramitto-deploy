import axios from "axios";
import {ProcedureResponse} from "../types/ProcedureResponse.interface.ts";
import {RegisterPaymentRequest} from "../types/RegisterPaymentRequest.interface.ts";

const BASE_URL: string = "http://165.1.120.191:3000/api/v1/procedures";

export const procedurePaymentService = {
  async registerPayment(paymentRequest: RegisterPaymentRequest): Promise<ProcedureResponse> {
    const response = await axios.post<ProcedureResponse>(`${BASE_URL}/payment`, paymentRequest);

    return response.data;
  }
};
