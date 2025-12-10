import axios from "axios";
import {ProcedureStatusEnum} from "../types/enum/ProcedureStatus.enum.ts";
import {ProcedureResponse} from "../types/ProcedureResponse.interface.ts";

const BASE_URL = 'http://165.1.120.191:3000/api/v1';

export const getAdminProceduresService = {
  async getProcedures(status?: ProcedureStatusEnum): Promise<ProcedureResponse[]> {
    const url = `${BASE_URL}/procedures/admin/procedures`;
    const {data} = await axios.get<ProcedureResponse[]>(url, {
      params: status ? {status} : undefined,
    });
    return data;
  },
};
