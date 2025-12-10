import axios from "axios";
import {ProcedureResponse} from "../types/ProcedureResponse.interface.ts";
import {CreateProcedureRequestInterface} from "../types/CreateProcedureRequest.interface.ts";

const BASE_URL: string = "https://test-app-ms.duckdns.org/api/v1/procedures";

export const procedureCreateService = {
  async createProcedure(createProcedureRequest: CreateProcedureRequestInterface): Promise<ProcedureResponse> {
    const response = await axios.post<ProcedureResponse>(`${BASE_URL}`, createProcedureRequest);
    return response.data;
  }
};
