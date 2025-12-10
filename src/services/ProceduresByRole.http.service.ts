import axios from "axios";
import {WorkflowStepNameEnum} from "../types/enum/WorkflowStepName.enum.ts";
import {ProcedureResponse} from "../types/ProcedureResponse.interface.ts";
import {PROCEDURE_TYPE_MAP} from "../types/record/procedureTypeMap.ts";
import {ProcedureTypeEnum} from "../types/enum/ProcedureType.enum.ts";

const BASE_URL: string = "https://test-app-ms.duckdns.org/api/v1/procedures/workflow/pending";

export const proceduresByRoleService = {
  async getProcedures(role: WorkflowStepNameEnum, procedureTypeId: number): Promise<ProcedureResponse[]> {
    if (procedureTypeId === PROCEDURE_TYPE_MAP[ProcedureTypeEnum.ALL]) {
      const response = await axios.get<ProcedureResponse[]>(`${BASE_URL}/${role}`);

      return response.data;
    }
    const response = await axios.get<ProcedureResponse[]>(`${BASE_URL}/${role}/procedure-type/${procedureTypeId}`);

    return response.data;
  }
};