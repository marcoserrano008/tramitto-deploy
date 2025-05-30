import {useCallback, useEffect, useState} from "react";
import {ProcedureResponse} from "../../../types/ProcedureResponse.interface.ts";
import {WorkflowStepNameEnum} from "../../../types/enum/WorkflowStepName.enum.ts";
import {proceduresByRoleService} from "../../../services/ProceduresByRole.http.service.ts";
import {ProcedureTypeEnum} from "../../../types/enum/ProcedureType.enum.ts";
import {PROCEDURE_TYPE_MAP} from "../../../types/record/procedureTypeMap.ts";

export function useFetchProcedures(workflowStepName: WorkflowStepNameEnum, procedureTypeEnum: ProcedureTypeEnum) {
  const [procedures, setProcedures] = useState<ProcedureResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const procedureTypeId: number | undefined = PROCEDURE_TYPE_MAP[procedureTypeEnum];

  const fetchProcedures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proceduresByRoleService.getProcedures(workflowStepName, procedureTypeId!);
      setProcedures(data);
    } catch (err: any) {
      console.error("Failed to fetch procedures:", err);
      setError("No se pudieron cargar los trámites. Por favor, intente nuevamente.",);
      setProcedures([]);
    } finally {
      setLoading(false);
    }
  }, [workflowStepName, procedureTypeEnum]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  return {procedures, loading, error, refetch: fetchProcedures};
}
