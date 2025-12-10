import {ProcedureResponse} from "../types/ProcedureResponse.interface.ts";
import axios from "axios";

const BASE_URL: string = "https://test-app-ms.duckdns.org/api/v1/procedures/user";

export const proceduresByUserIdService = {
  async getProcedures(userId: number): Promise<ProcedureResponse[]> {
    const response = await axios.get<ProcedureResponse[]>(`${BASE_URL}/${userId}`);
    return response.data;
  }
};
