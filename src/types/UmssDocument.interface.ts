import {DocumentProcedureTypeEnum} from "./enum/DocumentProcedureType.enum.ts";

export interface UmssDocument {
  id: number;
  codigoDocumento: string;
  idArchivo: number;
  descripcion: string;
  gestion: number;
  carnetIdentidad: number;
  complemento: string;
  codigoSis: number;
  tipoProcedimiento: DocumentProcedureTypeEnum;
}
