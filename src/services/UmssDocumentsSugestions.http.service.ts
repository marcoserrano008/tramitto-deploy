import axios from "axios";
import {DocumentProcedureTypeEnum} from "../types/enum/DocumentProcedureType.enum.ts";
import {UmssDocument} from "../types/UmssDocument.interface.ts";

const BASE_URL = 'https://test-app-ms.duckdns.org/api/v1';

export const umssDocumentsSugestions = {
  async get(codigoSis: number, tipoProcedimiento: DocumentProcedureTypeEnum): Promise<UmssDocument[]> {
    const url = `${BASE_URL}/procedures/umss-documents/suggestions`;
    const {data} = await axios.get<UmssDocument[]>(url, {
      params: {
        codigoSis: codigoSis,
        tipoProcedimiento: tipoProcedimiento
      },
    });
    return data;
  },
};
