import {ProcedureTypeEnum} from "../enum/ProcedureType.enum.ts";

export const PROCEDURE_TYPE_MAP: Record<ProcedureTypeEnum, number> = {
  [ProcedureTypeEnum.HIGH_SCHOOL_DIPLOMA]: 1,
  [ProcedureTypeEnum.ACADEMIC_DIPLOMA]: 2,
  [ProcedureTypeEnum.NATIONAL_PROVISION_DEGREE]: 3,
  [ProcedureTypeEnum.ALL]: 4
};

export const reverseProcedureTypeMap = Object.fromEntries(
  Object.entries(PROCEDURE_TYPE_MAP).map(([key, value]) => [value, key])
) as Record<number, ProcedureTypeEnum>;
