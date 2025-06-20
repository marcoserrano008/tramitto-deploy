import {ProcedureStatusEnum} from "./enum/ProcedureStatus.enum.ts";
import {ProcedureCounterResponse} from "./ProcedureCounterResponse.interface.ts";

export interface StatusCountersResponse {
  status: ProcedureStatusEnum;
  counters: ProcedureCounterResponse[];
}