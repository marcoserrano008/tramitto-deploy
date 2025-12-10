import axios from "axios";
import {ProcedureTypeResponse} from "../types/ProcedureTypeResponse.interface.ts";

const BASE_URL: string = "https://test-app-ms.duckdns.org/api/v1";

export const procedureTypesService = {
  async getAllProcedures(): Promise<ProcedureTypeResponse[]> {
    const response = await axios.get<ProcedureTypeResponse[]>(`${BASE_URL}/procedures/procedure-type`);
    return response.data;
  },

  async updateProcedure(id: number, payload: Partial<ProcedureTypeResponse>): Promise<ProcedureTypeResponse> {
    const { data } = await axios.put<ProcedureTypeResponse>(`${BASE_URL}/procedures/procedure-type/${id}`, payload,);
    return data;
  }
};
