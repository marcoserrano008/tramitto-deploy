import {ProcedureTypeEnum} from "./enum/ProcedureType.enum.ts";

export const urlToProcedureEnum: Record<string, ProcedureTypeEnum> = {
  'diploma-bachiller': ProcedureTypeEnum.HIGH_SCHOOL_DIPLOMA,
  'diploma-academico': ProcedureTypeEnum.ACADEMIC_DIPLOMA,
  'titulo-provision': ProcedureTypeEnum.NATIONAL_PROVISION_DEGREE
};
