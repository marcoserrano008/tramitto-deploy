import axios from 'axios';

const API = axios.create({
  baseURL: 'https://test-app-ms.duckdns.org/api/v1',
  responseType: 'blob',
});

export async function fetchDocument(documentId: string): Promise<Blob> {
  const { data } = await API.get(`/document/${documentId}`);
  return data;
}
