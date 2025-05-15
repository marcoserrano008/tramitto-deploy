import {DocumentTypeEnum} from "./enum/DocumentType.enum.ts";

export interface ProcedureDocumentResponse {
  id: number;
  documentType: DocumentTypeEnum;
  documentId: string;
  uploadDate: string;
}
