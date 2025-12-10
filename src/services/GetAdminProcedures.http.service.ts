import axios from "axios";
import {ProcedureStatusEnum} from "../types/enum/ProcedureStatus.enum.ts";
import {ProcedureResponse} from "../types/ProcedureResponse.interface.ts";

const BASE_URL = 'https://test-app-ms.duckdns.org/api/v1';

export const getAdminProceduresService = {
  async getProcedures(status?: ProcedureStatusEnum): Promise<ProcedureResponse[]> {
    const url = `${BASE_URL}/procedures/admin/procedures`;
    const {data} = await axios.get<ProcedureResponse[]>(url, {
      params: status ? {status} : undefined,
    });
    return data;
  },
};
