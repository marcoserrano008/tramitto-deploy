import axios from "axios";
import {PersonReduced} from "../types/PersonReduced.interface.ts";

const BASE_URL = 'https://test-app-ms.duckdns.org/api/v1';

export const getPersonaByDocumentService = {
  async getPersona(document: number): Promise<PersonReduced> {
    const url = `${BASE_URL}/procedures/personas/documento/${document}/simple`;
    const { data } = await axios.get<PersonReduced[]>(url);
    return data[0] ?? null;
  },
};
