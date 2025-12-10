import axios from "axios";
import {DocumentProcedureTypeEnum} from "../types/enum/DocumentProcedureType.enum.ts";
import {UmssDocument} from "../types/UmssDocument.interface.ts";

const BASE_URL = 'http://165.1.120.191:3000/api/v1';

export const umssDocument = {
  async get(codigoDocumento: string, codigoSis: number, gestion: number, tipoProcedimiento: DocumentProcedureTypeEnum): Promise<UmssDocument> {
    const url = `${BASE_URL}/procedures/umss-documents/by-code`;
    const {data} = await axios.get<UmssDocument>(url, {
      params: {
        codigoDocumento: codigoDocumento,
        codigoSis: codigoSis,
        gestion: gestion,
        tipoProcedimiento: tipoProcedimiento
      },
    });
    return data;
  },
};
