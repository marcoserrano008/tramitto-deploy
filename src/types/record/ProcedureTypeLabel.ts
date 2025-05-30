import {ProcedureTypeEnum} from "../enum/ProcedureType.enum.ts";

export const PROCEDURE_TYPE_LABEL: Record<ProcedureTypeEnum, string> = {
  [ProcedureTypeEnum.ALL]: 'Todos los tramites',
  [ProcedureTypeEnum.HIGH_SCHOOL_DIPLOMA]: 'Legalización de Diploma de bachiller',
  [ProcedureTypeEnum.ACADEMIC_DIPLOMA]: 'Legalización de Diploma Académico',
  [ProcedureTypeEnum.NATIONAL_PROVISION_DEGREE]: 'Legalización de Título en Provisión Nacional',
};
