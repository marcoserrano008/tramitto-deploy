import {useCallback, useEffect, useState} from "react";
import {ProcedureResponse} from "../../../types/ProcedureResponse.interface.ts";
import {WorkflowStepNameEnum} from "../../../types/enum/WorkflowStepName.enum.ts";
import {proceduresByRoleService} from "../../../services/ProceduresByRole.http.service.ts";

export function useFetchProcedures(workflowStepName: WorkflowStepNameEnum) {
  const [procedures, setProcedures] = useState<ProcedureResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcedures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proceduresByRoleService.getProcedures(workflowStepName);
      setProcedures(data);
    } catch (err: any) {
      console.error("Failed to fetch procedures:", err);
      setError("No se pudieron cargar los trámites. Por favor, intente nuevamente.",);
      setProcedures([]);
    } finally {
      setLoading(false);
    }
  }, [workflowStepName]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  return {procedures, loading, error, refetch: fetchProcedures};
}
