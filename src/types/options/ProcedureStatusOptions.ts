import {ProcedureStatusEnum} from "../enum/ProcedureStatus.enum.ts";

export const PROCEDURE_STATUS_OPTIONS = [
  { label: 'Todos', value: 'ALL' },
  { label: 'En revisión de archivos', value: ProcedureStatusEnum.ARCHIVES_REVIEW },
  { label: 'Completados', value: ProcedureStatusEnum.COMPLETED },
  { label: 'Rechazados', value: ProcedureStatusEnum.REJECTED },
] as const;

export type StatusFilter = (typeof PROCEDURE_STATUS_OPTIONS)[number]['value'];