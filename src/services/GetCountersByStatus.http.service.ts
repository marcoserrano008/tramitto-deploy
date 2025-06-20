import axios, {AxiosInstance} from "axios";
import {ProcedureStatusEnum} from "../types/enum/ProcedureStatus.enum.ts";
import {ProcedureCounterResponse} from "../types/ProcedureCounterResponse.interface.ts";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'
});

export const getProcedureCounters = async (status: ProcedureStatusEnum): Promise<ProcedureCounterResponse[]> => {
  const { data } = await api.get<ProcedureCounterResponse[]>('/procedures/stats', {
    params: { status }
  });

  return data;
};
