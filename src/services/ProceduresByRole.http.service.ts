import axios from "axios";
import {WorkflowStepNameEnum} from "../types/enum/WorkflowStepName.enum.ts";
import {ProcedureResponse} from "../types/ProcedureResponse.interface.ts";

const BASE_URL: string = "http://localhost:3000/api/v1/procedures/workflow/pending";

export const proceduresByRoleService = {
  async getProcedures(role: WorkflowStepNameEnum): Promise<ProcedureResponse[]> {
    const response = await axios.get<ProcedureResponse[]>(`${BASE_URL}/${role}`);
    return response.data;
  }
};