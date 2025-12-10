import {FileResponse} from "../types/FileResponse.interface.ts";
import axios from "axios";

const BASE_URL = 'https://test-app-ms.duckdns.org/api/v1';

export const uploadFileService = {
  async upload(file: File, description?: string): Promise<FileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    if (description) {
      formData.append('description', description);
    }

    const {data} = await axios.post<FileResponse>(`${BASE_URL}/document/upload`, formData,);
    return data;
  },
};
