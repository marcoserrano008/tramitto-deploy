import {DeudaVerificacionData} from "./DeudaVerificacionData.interface.ts";

export interface VerificarDeudaResponse {
  success: boolean;
  data: DeudaVerificacionData;
}