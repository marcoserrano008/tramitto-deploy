import {useEffect, useState} from 'react';
import {ProcedureTypeEnum} from "../../../types/enum/ProcedureType.enum.ts";
import {ProcedureTypeResponse} from "../../../types/ProcedureTypeResponse.interface.ts";
import {procedureTypeService} from "../../../services/ProcedureType.http.service.ts";

const PROCEDURE_TYPE_MAP: Record<ProcedureTypeEnum, number> = {
  [ProcedureTypeEnum.HIGH_SCHOOL_DIPLOMA]: 1,
  [ProcedureTypeEnum.ACADEMIC_DIPLOMA]: 2,
  [ProcedureTypeEnum.NATIONAL_PROVISION_DEGREE]: 3
};

export interface ProcedureHookResult {
  procedure: ProcedureTypeResponse | null;
  loading: boolean;
  error: string | null;
  procedureId: number | undefined;
}

export function useProcedureTypeData(procedureTypeEnum: ProcedureTypeEnum): ProcedureHookResult {
  const [procedure, setProcedure] = useState<ProcedureTypeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProcedureData = async () => {
      setLoading(true);
      try {
        const procedureId: number = PROCEDURE_TYPE_MAP[procedureTypeEnum];

        if (!procedureId) {
          throw new Error(`Unknown procedure type: ${procedureTypeEnum}`);
        }

        const response: ProcedureTypeResponse = await procedureTypeService.getProcedureType(procedureId);

        setProcedure(response);
      } catch (err) {
        console.error('Error fetching procedure data:', err);
        setError('Failed to load procedure information');
      } finally {
        setLoading(false);
      }
    };

    void fetchProcedureData();
  }, [procedureTypeEnum]);

  return {
    procedure,
    loading,
    error,
    procedureId: PROCEDURE_TYPE_MAP[procedureTypeEnum]
  };
}
