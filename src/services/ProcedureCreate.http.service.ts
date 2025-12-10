import axios from "axios";
import {ProcedureResponse} from "../types/ProcedureResponse.interface.ts";
import {CreateProcedureRequestInterface} from "../types/CreateProcedureRequest.interface.ts";

const BASE_URL: string = "http://165.1.120.191:3000/api/v1/procedures";

export const procedureCreateService = {
  async createProcedure(createProcedureRequest: CreateProcedureRequestInterface): Promise<ProcedureResponse> {
    const response = await axios.post<ProcedureResponse>(`${BASE_URL}`, createProcedureRequest);
    return response.data;
  }
};
