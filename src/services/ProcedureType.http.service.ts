import axios from "axios";
import {ProcedureTypeResponse} from "../types/ProcedureTypeResponse.interface.ts";

const BASE_URL: string = "https://test-app-ms.duckdns.org/api/v1/procedures";

export const procedureTypeService = {
  async getProcedureType(id: number): Promise<ProcedureTypeResponse> {
    const response = await axios.get<ProcedureTypeResponse>(`${BASE_URL}/procedure-type/${id}`);
    return response.data;
  }
};
