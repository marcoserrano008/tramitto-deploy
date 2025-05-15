import {fetchDocument} from "../services/Document.http.service.ts";

export async function handleDownload(documentId: string, filename?: string) {
  const blob = await fetchDocument(documentId);
  const url  = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename ?? `document-${documentId}.pdf`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  URL.revokeObjectURL(url);
}

export async function handlePreview(documentId: string) {
  const blob = await fetchDocument(documentId);
  const url  = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
