import axios from 'axios';

const API = axios.create({
  baseURL: 'http://165.1.120.191:3000/api/v1',
  responseType: 'blob',
});

export async function fetchDocument(documentId: string): Promise<Blob> {
  const { data } = await API.get(`/document/${documentId}`);
  return data;
}
